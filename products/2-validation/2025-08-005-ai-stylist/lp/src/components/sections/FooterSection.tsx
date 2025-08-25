import React from 'react'
import { TemplateConfig } from '@/types/template'
import * as Icons from 'lucide-react'

interface FooterSectionProps {
  config: TemplateConfig['content']['footer']
}

export default function FooterSection({ config }: FooterSectionProps) {
  const getSocialIcon = (platform: string) => {
    const iconMap: Record<string, any> = {
      twitter: Icons.Twitter,
      facebook: Icons.Facebook,
      instagram: Icons.Instagram,
      linkedin: Icons.Linkedin,
      github: Icons.Github,
      youtube: Icons.Youtube,
    }
    const IconComponent = iconMap[platform.toLowerCase()] || Icons.Globe
    return <IconComponent className="w-5 h-5" />
  }

  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container-width">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold mb-4">{config.companyName}</h3>
            {config.description && (
              <p className="text-gray-400 leading-relaxed">
                {config.description}
              </p>
            )}
            
            {config.socialLinks && config.socialLinks.length > 0 && (
              <div className="flex space-x-4 mt-4">
                {config.socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={social.platform}
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>
          
          {config.sections && config.sections.map((section, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => {
                  const handleClick = (e: React.MouseEvent) => {
                    if (link.url === '/pricing') {
                      e.preventDefault()
                      const pricingSection = document.getElementById('pricing-section')
                      if (pricingSection) {
                        pricingSection.scrollIntoView({ behavior: 'smooth' })
                      }
                    } else if (link.url === '/contact') {
                      e.preventDefault()
                      const formSection = document.getElementById('form-section')
                      if (formSection) {
                        formSection.scrollIntoView({ behavior: 'smooth' })
                      }
                    }
                  }
                  
                  return (
                    <li key={linkIndex}>
                      <a
                        href={link.url}
                        onClick={handleClick}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {link.text}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p className="text-sm">
            {config.copyright || `© ${new Date().getFullYear()} ${config.companyName}. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  )
}