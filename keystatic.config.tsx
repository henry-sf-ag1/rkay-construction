import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  singletons: {
    siteSettings: singleton({
      label: 'Site Settings',
      path: 'src/content/site-settings/',
      schema: {
        companyName: fields.text({ label: 'Company Name' }),
        email: fields.text({ label: 'Email' }),
        phone: fields.text({ label: 'Phone' }),
        address: fields.text({ label: 'Address' }),
        tagline: fields.text({ label: 'Tagline' }),
        subtagline: fields.text({ label: 'Sub-tagline' }),
        social: fields.object({
          facebook: fields.text({ label: 'Facebook URL' }),
          instagram: fields.text({ label: 'Instagram URL' }),
          linkedin: fields.text({ label: 'LinkedIn URL' }),
        }, { label: 'Social Links' }),
        projectTypes: fields.array(
          fields.text({ label: 'Project Type' }),
          {
            label: 'Project Types',
            itemLabel: (props) => props.value || 'New type',
          }
        ),
      },
    }),
  },
  collections: {
    services: collection({
      label: 'Services',
      slugField: 'title',
      path: 'src/content/services/*',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        icon: fields.text({ label: 'Icon (Lucide icon name)', description: 'e.g. Home, Building2, Wrench' }),
        order: fields.integer({ label: 'Display Order', defaultValue: 0 }),
      },
    }),
    projects: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'src/content/projects/*',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        location: fields.text({ label: 'Location' }),
        image: fields.text({ label: 'Image Path', description: 'Path to image, e.g. /images/projects/photo.jpg' }),
        order: fields.integer({ label: 'Display Order', defaultValue: 0 }),
      },
    }),
    testimonials: collection({
      label: 'Testimonials',
      slugField: 'name',
      path: 'src/content/testimonials/*',
      schema: {
        name: fields.slug({ name: { label: 'Client Name' } }),
        location: fields.text({ label: 'Location' }),
        quote: fields.text({ label: 'Quote', multiline: true }),
        order: fields.integer({ label: 'Display Order', defaultValue: 0 }),
      },
    }),
  },
});
