import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { GatsbyImage } from "gatsby-plugin-image"
import { convertCategory, mergePosts } from "../utilFunction"
import { ContentsOrderedListWrapper } from "../style"
import Pagination from "../components/pagination"

type BlogIndexProps = {
  data: {
    allMdx: AllMdx
    allFile: AllFile
  }
  location: Location
}

const BlogIndex = ({ data, location }: BlogIndexProps) => {

  const posts = mergePosts(data.allMdx, data.allFile)

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

  const POST_PER_PAGE = 12
  const maxPage = Math.ceil(posts.length / POST_PER_PAGE)

  return (
    <Layout location={location}>
      <ContentsOrderedListWrapper>
        {posts.slice(0, POST_PER_PAGE).map(post => {
          return (
            <li key={post.slug}>
              <article
                className="post-list-item"
                itemType="https://schema.org/Article"
              >
                <Link to={`/${convertCategory(post.category)}/${post.slug}`} itemProp="url">
                  <h2>
                    <span itemProp="headline">{post.title}</span>
                  </h2>
                  <section>
                    <div style={{ textAlign: "right" }}><small>
                      <time>{post.date}</time>
                    </small></div>
                    <div className="thumbnail">
                      {typeof post.gatsbyImage === "undefined" ||
                        <GatsbyImage alt={post.altText} image={post.gatsbyImage} />
                      }
                    </div>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: post.excerpt
                      }}
                      itemProp="description"
                    />
                  </section>
                </Link>
              </article>
            </li>
          )
        })}
      </ContentsOrderedListWrapper>
      <Pagination maxPage={maxPage} current={1}/>
    </Layout>
  )
}

export default BlogIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = ({ location }: BlogIndexProps) => <Seo title="" location={location}/>

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
          category
        }
      }
    }
  }
`
