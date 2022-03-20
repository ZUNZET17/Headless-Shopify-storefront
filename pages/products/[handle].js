import { shopifyGqlRequest } from '../../lib/shopify'
import AddToCart from '../../components/AddToCart';
import RelatedProducts from '../../components/RelatedProducts';

const reviews = { href: '#', average: 4, totalCount: 117 }

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function SingleProduct({ product, products }) {
  const productId = product.variants.edges[0].node.id
  const { title, description } = product;
  const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(product.priceRange.minVariantPrice.amount);
  const image = product.images.edges[0].node.transformedSrc;
  const alt = product.images.edges[0].node.altText;
  const relatedProducts = products.edges
    .filter(item => item.node.handle !== product.handle )
    .slice(0, 4);
  
  return (
    <div className="bg-white">
      <div className="pt-6 lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* <nav aria-label="Breadcrumb">
          <ol role="list" className="max-w-2xl mx-auto px-4 flex items-center space-x-2 sm:px-6 lg:max-w-7xl lg:px-8">
            {product.breadcrumbs.map((breadcrumb) => (
              <li key={breadcrumb.id}>
                <div className="flex items-center">
                  <a href={breadcrumb.href} className="mr-2 text-sm font-medium text-gray-900">
                    {breadcrumb.name}
                  </a>
                  <svg
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="w-4 h-5 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>
            ))}
            <li className="text-sm">
              <a href={product.href} aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">
                {product.name}
              </a>
            </li>
          </ol>
        </nav> */}

        {/* Image gallery */}
        <div className="mt-6 max-w-2xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="sm:rounded-lg sm:overflow-hidden">
            <img
              src={image}
              alt={alt}
              className="w-full h-full object-center object-cover"
            />
          </div>
        </div>

        {/* Product info */}
        <div className="max-w-2xl mx-auto pt-10 pb-16 px-4 sm:px-6 lg:max-w-7xl lg:pt-16 lg:pb-24 lg:px-8">
            <h2 className="sr-only">Product information</h2>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{title}</h1>
            <p className="text-3xl text-gray-900">{price}</p>
            <div className="py-10 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
              {/* Description and details */}
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6">
                <p className="text-base text-gray-900">{description}</p>
              </div>
            </div>
            <form className="mt-10">
              {/* Submit Button */}
              <AddToCart id={productId} />
            </form>
        </div>
      </div>
      <RelatedProducts  products={relatedProducts} />
    </div>
  )
}

export async function getStaticPaths() {
  const data = await shopifyGqlRequest(productsQuery);
  return {
    paths: data.products.edges.map(item => ({ params: { handle: item.node.handle } }) ),
    fallback: false
  }
};

export async function getStaticProps({params}) {
  const data = await shopifyGqlRequest(singleProductQuery, { handle: params.handle } )
  console.log('daya', data)
  return {
    props: {
      product: data.productByHandle,
      products: data.products
    }
  }
}

const gql = String.raw;

const productsQuery = gql`
  query products {
  products(first: 12) {
    edges {
      node {
        handle
      }
    }
  }
 }
`

const singleProductQuery = gql`
  query SingleProduct($handle: String!) {
  productByHandle(handle: $handle) {
    handle
    title
    description
    tags  
    variants(first: 1) {
      edges {
        node {
          id
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
      }
    }
    images(first:1) {
      edges {
        node {
          transformedSrc
          altText
        }
      }
    }
  }
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