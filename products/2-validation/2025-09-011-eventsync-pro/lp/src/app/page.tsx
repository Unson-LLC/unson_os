import LandingPageTemplate from '@/components/templates/LandingPageTemplate'
import config from '../../lp-config.json'
import { TemplateConfig } from '@/types/template'

export default function HomePage() {
  return <LandingPageTemplate config={config as unknown as TemplateConfig} />
}
