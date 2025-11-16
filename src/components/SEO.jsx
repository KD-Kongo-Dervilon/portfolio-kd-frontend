// src/components/SEO.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://kddervilon.com';

const SEO = ({
  title = 'KD Dervilon | Chef de Projet IA & Product Owner',
  description = 'Chef de Projet IA & Product Owner. J’orchestre des MVP IA pragmatiques (RAG, LLM, Agents, automatisation de workflows avec n8n) avec un time-to-value court, une gouvernance claire, et un ROI mesurable.',
  keywords = 'chef de projet IA, product owner, IA, intelligence artificielle, RAG, LLM, agents IA, GPT-4, Scrum, Agile, Product Management, serious game, éditeur pédagogique, Ludicius, Le Bahut, automatisation, n8n, automatisation de workflows, no-code, low-code',
  ogImage = `${BASE_URL}/images/og-image.jpg`,
  canonicalUrl, // optionnel : on peut le surcharger manuellement si besoin
}) => {
  const location = useLocation();

  const resolvedCanonical =
    canonicalUrl || `${BASE_URL}${location.pathname || ''}`;

  // Données structurées : Person (source de vérité unique)
  const personStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'KD Dervilon',
    alternateName: 'Dervilon Mbissi Kongo',
    jobTitle: 'Chef de Projet IA & Product Owner',
    url: BASE_URL,
    email: 'dervilon.mbissi@gmail.com',
    telephone: '+33636158831',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Le Mans',
      addressRegion: 'Pays de la Loire',
      addressCountry: 'FR',
    },
    sameAs: [
      'https://www.linkedin.com/in/kongo-dervilon/',
      'https://github.com/KD-Kongo-Dervilon',
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Ludicius',
    },
    alumniOf: [
      {
        '@type': 'EducationalOrganization',
        name: 'Le Bahut',
      },
    ],
    knowsAbout: [
      'Intelligence Artificielle',
      'RAG',
      'LLM',
      'Agents IA',
      'Product Management',
      'Scrum',
      'Agile',
      'Serious Games',
      'Outils pédagogiques IA',
      'Automatisation',
      'Automatisation de workflows',
      'n8n',
      'Outils no-code',
      'Outils low-code',
    ],
  };

  // Données structurées : Site
  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'KD Dervilon - Chef de Projet IA & Product Owner',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/?s={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  // Données structurées : Page
  const webpageStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: resolvedCanonical,
    name: title,
    description,
    inLanguage: 'fr-FR',
    isPartOf: {
      '@type': 'WebSite',
      url: BASE_URL,
      name: 'KD Dervilon - Portfolio IA & Product',
    },
  };

  return (
    <Helmet
      htmlAttributes={{
        lang: 'fr',
      }}
    >
      {/* Meta de base */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={resolvedCanonical} />

      {/* Indexation & preview */}
      <meta
        name="robots"
        content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"
      />
      <meta name="author" content="KD Dervilon (Dervilon Mbissi Kongo)" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />

      {/* Open Graph */}
      <meta
        property="og:site_name"
        content="KD Dervilon - Chef de Projet IA & Product Owner"
      />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={resolvedCanonical} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Données structurées JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(websiteStructuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(personStructuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(webpageStructuredData)}
      </script>

      {/* Preconnect pour les fonts uniquement si utilisées */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
    </Helmet>
  );
};

export default SEO;