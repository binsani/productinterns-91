interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'JobPosting' | 'Course' | 'Article';
  data: Record<string, any>;
}

export const StructuredData = ({ type, data }: StructuredDataProps) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
};

// Predefined structured data for common use cases
export const OrganizationData = () => (
  <StructuredData
    type="Organization"
    data={{
      name: "InternshipConnect",
      url: "https://internshipconnect.app",
      logo: "/icon-512x512.png",
      description: "Find and apply to top internship opportunities. Connect with leading companies and kickstart your career journey.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: "English"
      },
      sameAs: [
        "https://twitter.com/internshipconnect",
        "https://linkedin.com/company/internshipconnect"
      ]
    }}
  />
);

export const WebSiteData = () => (
  <StructuredData
    type="WebSite"
    data={{
      name: "InternshipConnect",
      url: "https://internshipconnect.app",
      description: "Find and apply to top internship opportunities. Connect with leading companies and kickstart your career journey.",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://internshipconnect.app/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }}
  />
);