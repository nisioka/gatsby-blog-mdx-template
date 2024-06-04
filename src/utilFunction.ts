import { getImage, IGatsbyImageData } from "gatsby-plugin-image"

export function mergePosts(allMdx: AllMdx, allFile?: AllFile) {
  let allFeaturedImages: { [key: string]: IGatsbyImageData } = {}
  allFile && allFile.edges.forEach(node => {
    allFeaturedImages[node.node.relativePath] = node.node.childImageSharp.gatsbyImageData
  })
  const mdxPosts = allMdx.nodes
  return mdxPosts.map(post => {
    const mdx: CommonPost = {
      title: post.frontmatter.title,
      excerpt: post.excerpt,
      slug: post.fields.slug.replace(/^\//, "").replace(/\/$/, ""),
      date: post.frontmatter.date,
      description: post.frontmatter.description,
      altText: post.frontmatter.featuredImagePath,
      gatsbyImage: getImage(allFeaturedImages[post.frontmatter.featuredImagePath || "featured/defaultThumbnail.png"]),
      category: post.frontmatter.category || "",
      tags: post.frontmatter.tags || []
    }
    return mdx
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) as CommonPost[]
}

export function mergePost(mdx?: MdxPost, allFile?: AllFile) {
  let allFeaturedImages: { [key: string]: IGatsbyImageData } = {}
  allFile && allFile.edges.forEach(node => {
    allFeaturedImages[node.node.relativePath] = node.node.childImageSharp.gatsbyImageData
  })
  return {
    title: mdx?.frontmatter.title,
    excerpt: mdx?.excerpt ,
    slug: mdx?.fields.slug,
    date: mdx?.frontmatter.date,
    description: mdx?.frontmatter.description,
    altText: mdx?.frontmatter.featuredImagePath || "",
    gatsbyImage: getImage(allFeaturedImages[mdx?.frontmatter.featuredImagePath || "featured/defaultThumbnail.webp"])
  } as CommonPost
}

const categoryNames: { eng: string, jp: string }[] = [
  { eng: "information-technology", jp: "技術" },
  { eng: "life", jp: "生活" },
  { eng: "event-report", jp: "イベントレポート" },
  { eng: "book-report", jp: "書評" },
  { eng: "business-efficiency", jp: "業務効率化" },
  { eng: "glossary", jp: "用語集" },
]

export function convertCategory(japanese: string) {
  return categoryNames.find(c => c.jp === japanese.replace("/", ""))?.eng || ""
}
