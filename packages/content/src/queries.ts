import { defineQuery } from "groq";

const imageFields = /* groq */ `
  ...,
  "alt": coalesce(alt, ""),
  "lqip": asset->metadata.lqip,
  "dimensions": asset->metadata.dimensions
`;

const projectCardFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  subtitle,
  "kind": coalesce(kind, "school"),
  category,
  year,
  featured,
  accentColor,
  coverImage{ ${imageFields} }
`;

export const settingsQuery = defineQuery(`
  *[_type == "settings"][0]{
    name,
    role,
    headline,
    intro,
    location,
    email,
    availableForWork,
    portrait{ ${imageFields} },
    socials[]{ _key, platform, url },
    skills,
    bio,
    seo{ title, description, "ogImage": ogImage{ ${imageFields} } }
  }
`);

export const featuredProjectsQuery = defineQuery(`
  *[_type == "project" && featured == true] | order(coalesce(sortOrder, 999) asc, year desc)[0...4]{
    ${projectCardFields}
  }
`);

export const projectsQuery = defineQuery(`
  *[_type == "project"] | order(coalesce(sortOrder, 999) asc, year desc){
    ${projectCardFields}
  }
`);

export const projectQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    ${projectCardFields},
    excerpt,
    role,
    team,
    body,
    videoUrl,
    gallery[]{ ${imageFields} },
    tools,
    links[]{ _key, label, url }
  }
`);

export const projectSlugsQuery = defineQuery(`
  *[_type == "project" && defined(slug.current)].slug.current
`);

export const jobsQuery = defineQuery(`
  *[_type == "job"] | order(coalesce(endDate, "9999-12-31") desc, startDate desc){
    _id,
    company,
    role,
    location,
    employmentType,
    startDate,
    endDate,
    url,
    summary,
    highlights,
    tools,
    logo{ ${imageFields} }
  }
`);

export const educationQuery = defineQuery(`
  *[_type == "education"] | order(coalesce(endYear, 9999) desc, startYear desc){
    _id,
    school,
    degree,
    location,
    startYear,
    endYear,
    description,
    logo{ ${imageFields} }
  }
`);

export const photosQuery = defineQuery(`
  *[_type == "photo"] | order(takenAt desc){
    _id,
    title,
    takenAt,
    location,
    "category": category->{ title, "slug": slug.current, "order": coalesce(sortOrder, 999) },
    image{ ${imageFields} }
  }
`);

export const homeQuery = defineQuery(`{
  "settings": ${settingsQuery},
  "projects": ${featuredProjectsQuery},
  "jobs": ${jobsQuery}[0...3],
  "photos": select(
    count(*[_type == "settings"][0].featuredPhotos[]->_id) > 0 =>
      (*[_type == "settings"][0].featuredPhotos[]->{ _id, title, takenAt, image{ ${imageFields} } })[defined(_id)],
    *[_type == "photo"] | order(takenAt desc)[0...6]{ _id, title, takenAt, image{ ${imageFields} } }
  )
}`);

export const experienceQuery = defineQuery(`{
  "jobs": ${jobsQuery},
  "education": ${educationQuery}
}`);
