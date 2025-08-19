import Script from 'next/script';

interface ClarityScriptProps {
  projectId?: string;
}

export default function ClarityScript({ 
  projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID 
}: ClarityScriptProps) {
  // 開発環境では無効化
  if (process.env.NODE_ENV === 'development' || !projectId) {
    return null;
  }

  return (
    <Script
      id="clarity-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${projectId}");
        `,
      }}
    />
  );
}