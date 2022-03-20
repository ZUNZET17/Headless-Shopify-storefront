import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import CartToast from './cart'
import { useState } from 'react'
import Link from 'next/link'

const navigation = [
  { name: 'Products', href: '#products' },
  { name: 'Features', href: '#' },
  { name: 'Blog', href: '#' },
  { name: 'About us', href: '#' },
]

export default function Header() {
  return (
  <div className='nav z-10 relative shadow-md'>
    <Popover>
      <div className="relative py-4 sm:px-6 lg:px-8">
        <nav className="relative grid grid-cols-3 smd:grid-cols-[1fr_auto_1fr] items-center justify-between sm:h-16" aria-label="Global">
          <div className="-mr-2 flex items-center smd:hidden">
            <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500">
              <span className="sr-only">Open main menu</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div>
          <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
            <div className="w-full md:w-auto">
              <Link href="/">
                <a className=''>
                  <span className="sr-only">Workflow</span>
                  <img
                    className="object-center object-cover my-0 mx-auto w-auto sm:h-16"
                    src="https://cdn.shopify.com/s/files/1/0623/7900/0029/files/organika-logo-black_cfeaa0a2-8879-457b-9c9f-b64d9a7b7630.png?v=1646157692"
                  />
                </a>
              </Link>
            </div>
          </div>
          <div className="hidden smd:block md:ml-10 md:pr-4 md:space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href="/products">
                <a className="font-medium text-gray-500 hover:text-lime-600/75">
                  {item.name}
                </a>
              </Link>
            ))}
          </div>
          <CartToast />
        </nav>
      </div>
      <Transition
        as={Fragment}
        enter="duration-150 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
        >
          <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div className="px-5 pt-4 flex items-center justify-between">
              <div>
                <p className='text-gray-800 font-bold text-3xl pb-6'>Organi<span className='text-lime-600/75'>Ka</span></p>
              </div>
              <div className="-mr-2">
                <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500">
                  <span className="sr-only">Close main menu</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </Popover.Button>
              </div>
            </div>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  </div>
  )
}
