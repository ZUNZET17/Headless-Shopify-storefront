import Link from "next/dist/client/link"
import { shopifyGqlRequest } from "../lib/shopify"

export default function Products(props) {
  return (
  <div id="related-products" className="featured-products max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
    <h2 className="text-2xl font-bold tracking-tight text-gray-800">Our Products</h2>
  
    <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {props.products.map(product => {
  
        const { handle, title } = product.node
        const { altText, originalSrc } = product.node.images.edges[0].node
        const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(product.node.priceRange.minVariantPrice.amount)
  
        return (
        <div key={handle} className="group relative">
          <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
            <img
              src={originalSrc}
              alt={altText}
              className="w-full h-full object-center object-cover lg:w-full lg:h-full"
            />
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-sm text-gray-700">
                <Link key={handle} href={`/products/${handle}`}>
                  <a>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {title}
                  </a>
                </Link>
              </h3>
              {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p> */}
            </div>
            <p className="text-sm font-medium text-gray-900">{price}</p>
          </div>
        </div>
      )})}
    </div>
  </div>
  )
}

export async function getStaticProps() {

  const data = await shopifyGqlRequest(query);

  return {
    props: {
      products: data.products.edges
    }
  }
};

const gql = String.raw;

const query = gql`
query Products {
  products(first: 12) {
    edges {
      node {
        id
        title
        handle
        priceRange {
          minVariantPrice {
            amount
          }
        }
        images(first: 5) {
          edges {
            node {
              originalSrc
              altText
            }
          }
        }
      }
    }
  }
}
`
