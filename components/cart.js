import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { useEffect } from 'react'
import { getStaticProps } from '../pages/products/[handle]'
import { createCart } from '../lib/shopify'
import { loadCart } from '../lib/shopify'
import { removeItems } from '../lib/shopify'

export default function CartToast() {
  const [cart, setCart] = useState({ id: null, lines: []})
  const [open, setOpen] = useState(false)
  let totalCartItems = cart.lines.length;
  

  useEffect(() => {
    async function getCart() {
      let localCartData = JSON.parse(
        window.localStorage.getItem('organika:shopify:cart')
      );

      if (localCartData) {
        const existingCart = await loadCart(localCartData.id).then(res => res);

        setCart({
          id: localCartData.id,
          checkoutUrl: localCartData.checkoutUrl,
          // TODO load these from existing cart
          estimatedCost: existingCart.estimatedCost.totalAmount.amount,
          lines: existingCart.lines.edges
        })

        return
      }
      
      localCartData = await createCart().then(res => res.cartCreate.cart);

      setCart({
        id: localCartData.cartId,
        checkoutUrl: localCartData.checkoutUrl,
        estimatedCost: null,
        lines: [],
      });

      window.localStorage.setItem(
        'organika:shopify:cart',
        JSON.stringify(localCartData),
      );
    }

    getCart();

    const interval = setInterval(() => {
      const status = window.localStorage.getItem('organika:shopify:status');

      if (status && status == 'changed') {
        getCart();
        setOpen(true)
        window.localStorage.setItem('organika:shopify:status', 'updated')
      }
    }, 500);

    return () => {
      clearInterval(interval);
    }
  }, []);

  function toggleToastCart () {
    setOpen(open => !open)
  }

  function emptyCart() {
    window.localStorage.removeItem('organika:shopify:cart');
    window.localStorage.setItem('organika:shopify:status', 'changed');
  }

  async function removeItem(lineId) {
    event.preventDefault();
    let localCartData = JSON.parse(
      window.localStorage.getItem('organika:shopify:cart')
    );
    const lineIds = [lineId];
    const result = await removeItems(localCartData.id, lineIds)
    window.localStorage.setItem('organika:shopify:status', 'changed');
    
    return result
  }

  return (
    <div className='ml-auto p-2'>
      <div onClick={() => toggleToastCart()} className="cart-button font-sans block lg:inline-block lg:mt-0 lg:ml-auto align-middle text-black hover:text-gray-700">
        <a href="#" role="button" className="relative flex">
          <svg className="flex-1 w-8 h-8 fill-current" viewbox="0 0 24 24">
            <path d="M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z"/>
          </svg>
          <span className="absolute right-0 top-0 rounded-full bg-lime-600 w-4 h-4 top right p-0 m-0 text-white font-mono text-sm  leading-tight text-center">
            {totalCartItems}
          </span>
        </a>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 overflow-hidden z-20" onClose={setOpen}>
          <div className="absolute inset-0 overflow-hidden">
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900"> Shopping cart </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-8">
                        <div className="flow-root">
                          <ul role="list" className="-my-6 divide-y divide-gray-200">
                            {cart.lines.map(({node: item}) => (
                              <li key="" className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img
                                    src={item.merchandise.product.images.edges[0].node.transformedSrc}
                                    alt={item.merchandise.product.images.edges[0].node.altText}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>
                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <a href={item.merchandise.product.onlineStoreUrl}> {item.merchandise.product.title} </a>
                                      </h3>
                                      <p className="ml-4">${item.estimatedCost.totalAmount.amount}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">${item.merchandise.priceV2.amount}</p>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <p className="text-gray-500">Qty {item.quantity}</p>
                                    <div className="flex">
                                      <button onClick={() => removeItem(item.id)} type="button" className="font-medium text-lime-600/75 hover:text-lime-600/75">
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>                  
                    </div>                        
                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>${cart.estimatedCost}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                      <div className="mt-6">
                        <a
                          href={cart.checkoutUrl}
                          className="flex items-center justify-center rounded-md border border-transparent bg-lime-600/75 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-lime-600"
                        >
                          Checkout
                        </a>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <button
                            type="button"
                            className="font-medium text-gray-600/75 underline hover:text-gray-600"
                            onClick={() => emptyCart()}
                          >
                            empty cart
                          </button>
                      </div>                      
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or{' '}
                          <button
                            type="button"
                            className="font-medium text-lime-600 hover:text-lime-500"
                            onClick={() => setOpen(false)}
                          >
                            Continue Shopping<span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}
