import * as React from "react"

import { graphql, Link } from "gatsby"
import { PageContext } from "gatsby/internal"
import { convertCategory, mergePosts } from "../utilFunction"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { GatsbyImage } from "gatsby-plugin-image"
import { ContentsListHeader, ContentsOrderedListWrapper } from "../style"

const CategoryList = ({ pageContext, data, location }: {pageContext: PageContext, data: any, location: Location}) => {
  const tagName = pageContext.tag as string
  const posts = mergePosts(data.allMdx, data.allFile)
  const title = `【${tagName}】タグ 一覧`

  return (
    <Layout location={location}>
      <ContentsListHeader>
        <h1>{title}</h1>
        <p>{posts.length} 記事あります</p>
      </ContentsListHeader>
      <ContentsOrderedListWrapper>
        {posts.map(post => {
          return (
            <li key={post.slug}>
              <article
                className="post-list-item"
                itemType="http://schema.org/Article"
              >
                <Link to={`/${convertCategory(post.category)}/${post.slug}`}>
                  <h2>
                    <span>{post.title}</span>
                  </h2>
                  <section>
                    <div><small>
                      <time>{post.date}</time>
                    </small></div>
                    <div className="thumbnail">
                      {typeof post.gatsbyImage === "undefined" ||
                        <GatsbyImage alt={post.altText} image={post.gatsbyImage} className="thumbnail" />
                      }
                    </div>
                    <p
                      dangerouslySetInnerHTML={{ __html: post.excerpt }}
                    />
                  </section>
                </Link>
              </article>
            </li>
          )
        })}
      </ContentsOrderedListWrapper>
    </Layout>
  )
}

export default CategoryList

export const Head = ({ pageContext, location }: {pageContext: PageContext, location: Location}) => {

  return (
    <Seo
      title={`【${pageContext.tag}】タグ 一覧`}
      description={`【${pageContext.tag}】タグの記事一覧です`}
      location={location}
    />
  )
}

export const pageQuery = graphql`
  query( $tag: String) {
    allMdx(
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
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
  }
`