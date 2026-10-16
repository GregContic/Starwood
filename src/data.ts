export type Room = {
  id: string
  name: string
  capacity: number
  regularRate: number
  peakRate: number
  image: string | null
  imageAlt: string
}

export const hotel = {
  name: 'Starwood Hotel Baguio',
  address: 'Kisad Road corner Marcos Highway, near BGH Rotunda, Baguio City, Philippines',
  telephone: '(074) 446-5830 to 32',
  telephoneHref: 'tel:+63744465830',
  mobile: '0917-597-2190',
  mobileHref: 'tel:+639175972190',
  email: 'bgostarwoodhotel@yahoo.com',
  website: 'https://www.starwoodhotelbaguio.com/',
  ratesSource:
    'https://starwoodhotelbaguio.com/index.php?Itemid=39&id=24&option=com_content&task=view',
  checkIn: '2:00 PM',
  checkOut: '12:00 noon',
  directions:
    'https://www.google.com/maps/search/?api=1&query=Starwood+Hotel+Baguio+Kisad+Road+corner+Marcos+Highway+Baguio+City',
} as const

export const rooms: Room[] = [
  {
    id: 'deluxe-1',
    name: 'Deluxe 1 (King)',
    capacity: 2,
    regularRate: 1400,
    peakRate: 2000,
    image: null,
    imageAlt: 'An authorized photograph of the Starwood Hotel Deluxe 1 (King) room is not available for use in this demo.',
  },
  {
    id: 'deluxe-2',
    name: 'Deluxe 2 (Queen)',
    capacity: 4,
    regularRate: 1960,
    peakRate: 2800,
    image: null,
    imageAlt: 'An authorized photograph of the Starwood Hotel Deluxe 2 (Queen) room is not available for use in this demo.',
  },
  {
    id: 'deluxe-3',
    name: 'Deluxe 3 (Queen)',
    capacity: 6,
    regularRate: 2520,
    peakRate: 3600,
    image: null,
    imageAlt: 'An authorized photograph of the Starwood Hotel Deluxe 3 (Queen) room is not available for use in this demo.',
  },
  {
    id: 'starwood-suite',
    name: 'Starwood Suite',
    capacity: 2,
    regularRate: 1960,
    peakRate: 2800,
    image: null,
    imageAlt: 'An authorized photograph of the Starwood Hotel Starwood Suite is not available for use in this demo.',
  },
  {
    id: 'family-suite',
    name: 'Family Suite',
    capacity: 8,
    regularRate: 3360,
    peakRate: 4800,
    image: null,
    imageAlt: 'An authorized photograph of the Starwood Hotel Family Suite is not available for use in this demo.',
  },
  {
    id: 'family-suite-jr',
    name: 'Family Suite Jr.',
    capacity: 6,
    regularRate: 2450,
    peakRate: 3500,
    image: null,
    imageAlt: 'An authorized photograph of the Starwood Hotel Family Suite Jr. is not available for use in this demo.',
  },
]

export const imagery = {
  hero: {
    src: `${import.meta.env.BASE_URL}images/hotel/baguio-pines-illustration.svg`,
    alt: 'Original pine hills illustration for the redesign concept; it does not depict Starwood Hotel or its actual surroundings.',
  },
  lobby: {
    src: null,
    alt: 'An authorized photograph of the Starwood Hotel lobby is not available for use in this demo.',
  },
  dining: {
    src: null,
    alt: 'An authorized photograph of the Starwood Hotel restaurant/function hall is not available for use in this demo.',
  },
  shop: {
    src: null,
    alt: 'An authorized photograph of the 7-Eleven referenced by the Starwood Hotel website is not available for use in this demo.',
  },
} as const

export const facilities = [
  {
    name: 'Hotel lobby',
    description:
      'The hotel website features a lobby. Please confirm current facilities directly with the hotel.',
    image: imagery.lobby,
  },
  {
    name: 'Restaurant / function hall',
    description:
      'A restaurant and function hall are shown on the hotel website. Current operation and details should be confirmed with the hotel.',
    image: imagery.dining,
  },
  {
    name: '7-Eleven',
    description:
      'A 7-Eleven is referenced on the hotel website; please confirm current operation and access directly.',
    image: imagery.shop,
  },
]

export const rateDisclaimer =
  'Reference rates published on the hotel’s website; actual rates and availability must be confirmed with the hotel. This independent redesign concept is not an official Starwood Hotel booking channel.'
