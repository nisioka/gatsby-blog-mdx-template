import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image"
import mergePosts from "../utilFunction"

type BlogIndexProps = {
  data: {
    allMdx: AllMdx
    allWpPost: AllWpPost
    allFile: AllFile
  }
  location: Location
}

const BlogIndex = ({ data, location }: BlogIndexProps) => {

  const posts = mergePosts(data.allMdx, data.allWpPost, data.allFile)

  if (posts.length === 0) {
    return (
      <Layout location={location}>
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location}>
      <ol style={{ listStyle: `none` }}>
        {posts.map(post => {
          const title = post.title || post.slug

          return (
            <li key={post.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="https://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={post.slug} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <div style={{ textAlign: "right" }}><small>
                    <time>{post.date}</time>
                  </small></div>
                </header>
                <section>
                  {typeof post.gatsbyImage === "undefined" ||
                    <GatsbyImage alt={post.altText} image={post.gatsbyImage} />
                  }
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.description || post.excerpt,
                    }}
                    itemProp="description"
                  />
                </section>
              </article>
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

export default BlogIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="All posts" />

export const pageQuery = graphql`
  {
    allFile(
      filter: {
        sourceInstanceName: { eq: "images" }
      }
    ) {
      edges {
        node {
          relativePath
          childImageSharp {
            gatsbyImageData(
              width: 100,
              height: 100
              formats: [AUTO, WEBP, AVIF]
              placeholder: BLURRED
            )
          }
        }
      }
    }
    allMdx(sort: { frontmatter: { date: DESC } }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          title
          date(formatString: "YYYY/MM/DD")
          description
          featuredImagePath
        }
      }
    }
    allWpPost(sort: { date: DESC }) {
      nodes {
        title
        excerpt
        slug
        date(formatString: "YYYY/MM/DD")
        featuredImage{
          node{
            altText
            gatsbyImage(
              width: 100,
              height: 100
              formats: [AUTO, WEBP, AVIF]
              placeholder: BLURRED
            )
          }
        }
      }
    }
  }
`
