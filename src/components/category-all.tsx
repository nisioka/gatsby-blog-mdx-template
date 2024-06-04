import * as React from "react"

import { Link } from "gatsby"
import styled from "styled-components"
import { convertCategory } from "../utilFunction"

const CategoryAll = ({title = "カテゴリ"}) => {

  const all = [
    '1',
    '2',
    '3',
  ]

  return (
    <CategoryAllTitle>
      <h5>{title}</h5>
      <ul>
      {all.map((category, index) => (
        <li key={index}>
          <Link to={`/category/${convertCategory(category)}`}>
            {category}
          </Link>
        </li>
      ))}
      </ul>
    </CategoryAllTitle>
  )
}

export default CategoryAll

const CategoryAllTitle = styled.div`
  background-color: #fff;
  
  h5 {
    margin-top: var(--spacing-1);
  }
  
  li {
    list-style: none;
    margin: var(--spacing-1);
  }
  
  
`