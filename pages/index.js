import { shopifyGqlRequest } from '../lib/shopify'
import Link from  'next/link';
import Image from 'next/image';
import heroImage from '../public/images/holistic-lifestyle.png'

export default function Homepage({products}) {
  return (
    <main>
      <div className="hero-section grid grid-rows-2 md:grid-rows-[55vw] lg:grid-rows-[40vw] md:grid-cols-2 relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <div className="mt-16 mx-auto max-w-7xl px-4 sm:mt-28 sm:px-6 md:mt-16 lg:mt-20 lg:px-12 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Welcome to Organi<strong className='text-lime-600/75'>ka</strong> </span>{' '}
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                A health and fitness blog and store. Find the latests health trends, recipes and products for the best shape of your life!
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <a
                      href="#products"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-lime-600/75 hover:bg-lime-700/75 md:py-4 md:text-lg md:px-10"
                    >
                      Get started
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative lg:inset-y-0 w-full">
          <Image 
          src={heroImage}
          alt="Natural life style avocado"
          layout='fill'
          objectFit='cover'
          objectPosition='center'          
          />
        </div>
      </div>      
      <div id="products" className="featured-products max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-800">Featured Products</h2>

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map(product => {

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
                </div>
                <p className="text-sm font-medium text-gray-900">{price}</p>
              </div>
            </div>
          )})}
        </div>
        <div className="mt-5 sm:mt-8 flex justify-center">
          <div className="rounded-md shadow">
            <Link href="/products">
              <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-lime-600/75 hover:bg-lime-700/75 md:py-4 md:text-lg md:px-10" >
                View All
              </a>
            </Link>
          </div>
        </div>
      </div>
    </main>
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
  products(first: 8) {
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


