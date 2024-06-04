/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

import path from "path"
import { GatsbyNode } from "gatsby"
import { createFilePath } from "gatsby-source-filesystem"
import { convertCategory } from "./src/utilFunction"

// Define the template for blog post
const blogPost = path.resolve(`./src/templates/blog-post.tsx`)
const pageList = path.resolve(`./src/templates/page-list.tsx`)
const categoryList = path.resolve(`./src/templates/category-list.tsx`)
const tagList = path.resolve(`./src/templates/tag-list.tsx`)

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
export const createPages: GatsbyNode['createPages'] = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  type AllPost = {
    allMdx: AllMdx
  }

  // Get all markdown blog posts sorted by date
  const result = await graphql<AllPost>(`
    {
      allMdx(sort: { frontmatter: { date: DESC } }, limit: 1000) {
        nodes {
          id
          fields {
            slug
          }
          internal {
            contentFilePath
          }
          frontmatter {
            featuredImagePath
            nodeType
            category
            tags
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  type Post = {
    id: string
    slug: string
    component: string
    featuredImagePath: string | null
    category: string
    tags: string[]
  }

  const posts = result.data?.allMdx.nodes.map(post => {
    const mdx: Post = {
      id: post.id,
      slug: post.fields.slug.replace(/^\//, "").replace(/\/$/, ""),
      component: `${blogPost}?__contentFilePath=${post.internal.contentFilePath}`,
      featuredImagePath: post.frontmatter.featuredImagePath,
      category: post.frontmatter.category,
      tags: post.frontmatter.tags,
    }
    return mdx
  });

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  if (posts && posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

      createPage({
        path: `/${convertCategory(post.category)}/${post.slug}`,
        component: post.component,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
          imagePath: post.featuredImagePath,
        },
      })
    })

    // 記事一覧追加
    const POST_PER_PAGE = 12
    const maxPage = Math.ceil(posts.length / POST_PER_PAGE)
    for (let pageNumber = 1; pageNumber < maxPage + 1; pageNumber++) {
      createPage({
        path: `/page/${pageNumber}`,
        component: pageList,
        context: {
          limit: POST_PER_PAGE,
          skip: (pageNumber - 1) * POST_PER_PAGE,
          current: pageNumber,
          maxPage: maxPage,
        },
      })
    }

    // カテゴリ一覧追加
    let categories = posts.reduce((categories, post) => {
      return (post.category && !categories.includes(post.category)) ? categories.concat(post.category) : categories
    }, [] as string[])
    // カテゴリ分ページを作成
    categories.forEach(category => {
      createPage({
        path: `/category/${convertCategory(category)}`,
        component: categoryList,
        context: {
          category
        }
      })
    })

    // tag一覧追加
    let tags = posts.reduce((tags, post) => {
      post.tags.forEach(tag => {
        tags = (tag && !tags.includes(tag)) ? tags.concat(tag) : tags
      });
      return tags
    }, [] as string[])
    // tag分ページを作成
    tags.forEach(tag => {
      createPage({
        path: `/tag/${tag}`,
        component: tagList,
        context: {
          tag
        }
      })
    })
  }
}

/**
 * @type {import('gatsby').GatsbyNode['onCreateNode']}
 */
export const onCreateNode: GatsbyNode['onCreateNode'] = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `Mdx`) {
    const value = createFilePath({ node, getNode })

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

/**
 * @type {import('gatsby').GatsbyNode['createSchemaCustomization']}
 */
export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "Mdx" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type Mdx implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
      nodeType: String
      category: String
      tags: [String]
      featuredImagePath: String
    }

    type Fields {
      slug: String
    }
  `)
}
