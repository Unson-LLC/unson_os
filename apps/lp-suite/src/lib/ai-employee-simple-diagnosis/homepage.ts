import type { HomepageReadResult, HomepageSnapshot } from './types';
import { normalizeWebsite, validateCompanyWebsite, warning } from './validate';

const MAX_BODY_BYTES = 300 * 1024;
const MAX_EXTRACTED_TEXT = 4000;
const MAX_REDIRECTS = 3;
const TIMEOUT_MS = 5000;

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFirstMatch(html: string, pattern: RegExp): string {
  const match = html.match(pattern);
  return (match?.[1] || '').replace(/\s+/g, ' ').trim();
}

function extractHeadings(html: string): string[] {
  const headings = Array.from(html.matchAll(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/gi))
    .map((match) => stripTags(match[1]))
    .filter(Boolean);

  return headings.slice(0, 6);
}

function summarizeHomepage(text: string, hostname: string): string {
  const trimmed = text.slice(0, 180).trim();
  if (!trimmed) {
    return `${hostname} の公開情報を確認しました。詳細診断では実際の業務フローを確認します。`;
  }

  return `${trimmed}... 公開情報と課題入力からAI社員化候補を出しています。`;
}

async function fetchTextWithLimit(url: string): Promise<{ text: string; finalUrl: string }> {
  let currentUrl = url;

  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(currentUrl, {
        redirect: 'manual',
        signal: controller.signal,
      });

      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get('location');
        if (!location) throw new Error('Redirect location is missing.');

        const nextUrl = new URL(location, currentUrl).toString();
        const validation = validateCompanyWebsite(nextUrl);
        if (validation) throw new Error('Blocked redirect URL.');

        currentUrl = nextUrl;
        continue;
      }

      if (!response.ok) throw new Error(`Homepage responded with ${response.status}.`);

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
        throw new Error('Homepage response is not HTML.');
      }

      const contentLength = Number(response.headers.get('content-length') || '0');
      if (contentLength > MAX_BODY_BYTES) throw new Error('Homepage response is too large.');

      const text = (await response.text()).slice(0, MAX_BODY_BYTES);
      return { text, finalUrl: currentUrl };
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error('Too many redirects.');
}

export function buildInputOnlySnapshot(website: string): HomepageSnapshot {
  const normalizedWebsite = normalizeWebsite(website);
  const parsed = new URL(normalizedWebsite);

  return {
    website: normalizedWebsite,
    hostname: parsed.hostname,
    inferred_company_name: parsed.hostname,
    homepage_title: '',
    homepage_summary: 'ホームページの読み取りはできませんでしたが、入力内容から診断しています。',
    confidence: 'low',
    source: 'input_only',
  };
}

export function parseHomepageSnapshot(website: string, html: string, finalUrl?: string): HomepageSnapshot {
  const normalizedWebsite = normalizeWebsite(finalUrl || website);
  const parsed = new URL(normalizedWebsite);
  const title = extractFirstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description = extractFirstMatch(
    html,
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i,
  );
  const headings = extractHeadings(html);
  const bodyText = stripTags(html).slice(0, MAX_EXTRACTED_TEXT);
  const signalText = [description, ...headings, bodyText].filter(Boolean).join(' ').slice(0, MAX_EXTRACTED_TEXT);

  return {
    website: normalizedWebsite,
    hostname: parsed.hostname,
    inferred_company_name: title || parsed.hostname,
    homepage_title: title,
    homepage_summary: summarizeHomepage(signalText, parsed.hostname),
    confidence: signalText.length > 120 ? 'medium' : 'low',
    source: 'homepage',
  };
}

export async function readHomepageSnapshot(website: string): Promise<HomepageReadResult> {
  const normalizedWebsite = normalizeWebsite(website);
  const validation = validateCompanyWebsite(normalizedWebsite);

  if (validation) {
    return { warnings: [validation] };
  }

  try {
    const { text, finalUrl } = await fetchTextWithLimit(normalizedWebsite);
    const snapshot = parseHomepageSnapshot(normalizedWebsite, text, finalUrl);
    const warnings =
      snapshot.confidence === 'low'
        ? [
            warning(
              'homepage_low_signal',
              '公開情報が少ないため、課題入力を中心に診断しています',
              'company.website',
            ),
          ]
        : [];

    return { snapshot, warnings };
  } catch {
    return {
      snapshot: buildInputOnlySnapshot(normalizedWebsite),
      warnings: [
        warning(
          'homepage_fetch_failed',
          'ホームページの読み取りはできませんでしたが、入力内容から診断できます',
          'company.website',
        ),
      ],
    };
  }
}
