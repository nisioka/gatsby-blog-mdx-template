import * as React from "react"

import { graphql, Link } from "gatsby"
import { PageContext } from "gatsby/internal"
import { convertCategory, mergePosts } from "../utilFunction"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { GatsbyImage } from "gatsby-plugin-image"
import { ContentsListHeader, ContentsOrderedListWrapper } from "../style"
import Pagination from "../components/pagination"

const PageList = ({ pageContext, data, location }: {pageContext: PageContext, data: any, location: Location}) => {
  const posts = mergePosts(data.allMdx, data.allFile)
  const title = `記事一覧`

  return (
    <Layout location={location}>
      <ContentsListHeader>
        <h1>{title}</h1>
        {/*<p>{posts} 記事あります</p>*/}
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
      <Pagination maxPage={pageContext.maxPage} current={pageContext.current} />
    </Layout>
  )
}

export default PageList

export const Head = ({ location }: {location: Location}) => {

  return (
    <Seo
      title={`記事一覧`}
      location={location}
    />
  )
}

export const pageQuery = graphql`
  query( $limit: Int!, $skip: Int!) {
    allMdx(
      limit: $limit
      skip: $skip
      sort: { frontmatter: { date: DESC } }
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