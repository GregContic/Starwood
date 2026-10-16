import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock3,
  Compass,
  Flower2,
  Mail,
  MapPin,
  Menu,
  Phone,
  UsersRound,
  X,
} from 'lucide-react'
import { facilities, hotel, imagery, rateDisclaimer, rooms, type Room } from './data'

type InquiryErrors = Partial<Record<'room' | 'checkIn' | 'checkOut' | 'adults' | 'name' | 'email', string>>

function createMapsEmbedUrl(apiKey: string | undefined) {
  const key = apiKey?.trim()
  if (!key) return null

  const query = new URLSearchParams({
    key,
    q: `${hotel.name}, ${hotel.address}`,
  })
  return `https://www.google.com/maps/embed/v1/place?${query.toString()}`
}

const mapsEmbedUrl = createMapsEmbedUrl(import.meta.env.VITE_GOOGLE_MAPS_API_KEY)

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(price)
}

function Photo({ src, alt, className = '' }: { src: string | null; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={`photo ${className}`}>
      {src && !failed ? (
        <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <div className="photo-fallback" role="img" aria-label={`${alt} No photograph is shown because reuse permission has not been established.`}>
          <Flower2 aria-hidden="true" />
          <span>Authentic photo<br />awaiting permission</span>
        </div>
      )}
      {src && !failed && <span className="photo-caption">Concept illustration</span>}
    </div>
  )
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [guestFilter, setGuestFilter] = useState('any')
  const [peakRates, setPeakRates] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [roomId, setRoomId] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [adults, setAdults] = useState('1')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<InquiryErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [processing, setProcessing] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const chosenRoom = rooms.find((room) => room.id === roomId)
  const visibleRooms = useMemo(
    () =>
      rooms.filter(
        (room) => guestFilter === 'any' || room.capacity >= Number(guestFilter),
      ),
    [guestFilter],
  )

  useEffect(() => {
    if (selectedRoom && dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal()
    }
  }, [selectedRoom])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  function openRoom(room: Room) {
    setSelectedRoom(room)
    setRoomId(room.id)
    setErrors({})
    setSubmitted(false)
    setMobileMenuOpen(false)
  }

  function closeDialog() {
    dialogRef.current?.close()
    setSelectedRoom(null)
  }

  function validateForm(): InquiryErrors {
    const nextErrors: InquiryErrors = {}
    const numberOfAdults = Number(adults)
    if (!roomId || !chosenRoom) nextErrors.room = 'Choose a room type.'
    if (!checkIn) nextErrors.checkIn = 'Choose a check-in date.'
    if (!checkOut) nextErrors.checkOut = 'Choose a check-out date.'
    else if (checkIn && checkOut <= checkIn) {
      nextErrors.checkOut = 'Check-out must be later than check-in.'
    }
    if (!adults || !Number.isInteger(numberOfAdults) || numberOfAdults < 1) {
      nextErrors.adults = 'Enter a positive whole number of adults.'
    } else if (chosenRoom && numberOfAdults > chosenRoom.capacity) {
      nextErrors.adults = `This room's published capacity is ${chosenRoom.capacity} adults.`
    }
    if (!name.trim()) nextErrors.name = 'Enter your full name.'
    if (!email.trim()) nextErrors.email = 'Enter your email address.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address.'
    }
    return nextErrors
  }

  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (processing || submitted) return
    const nextErrors = validateForm()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setProcessing(true)
    await new Promise((resolve) => window.setTimeout(resolve, 350))
    setProcessing(false)
    setSubmitted(true)
  }

  const emailSubject = `Stay inquiry - ${chosenRoom?.name ?? hotel.name}`
  const emailBody = [
    `Hello ${hotel.name},`,
    '',
    'I would like to inquire about a stay.',
    `Room: ${chosenRoom?.name ?? ''}`,
    `Check-in: ${checkIn}`,
    `Check-out: ${checkOut}`,
    `Adults: ${adults}`,
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : '',
    message ? `Message: ${message}` : '',
    '',
    'Please confirm availability and current rates.',
  ]
    .filter(Boolean)
    .join('\n')
  const emailInquiryHref = `mailto:${hotel.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#home" aria-label={`${hotel.name} home`}>
            <span className="wordmark-icon"><Flower2 size={23} strokeWidth={1.45} /></span>
            <span className="wordmark-copy">
              <strong>STARWOOD</strong>
              <small>HOTEL · BAGUIO</small>
            </span>
          </a>
          <button
            className="mobile-toggle icon-button"
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="main-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
          <nav
            id="main-navigation"
            className={`main-nav ${mobileMenuOpen ? 'is-open' : ''}`}
            aria-label="Main navigation"
          >
            <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#rooms" onClick={() => setMobileMenuOpen(false)}>Rooms</a>
            <a href="#amenities" onClick={() => setMobileMenuOpen(false)}>Amenities</a>
            <a href="#location" onClick={() => setMobileMenuOpen(false)}>Location</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
            <a className="button button-dark nav-cta" href="#rooms" onClick={() => setMobileMenuOpen(false)}>
              Explore rooms <ArrowUpRight size={16} />
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-image">
            <img
              src={imagery.hero.src}
              alt={imagery.hero.alt}
              fetchPriority="high"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          </div>
          <div className="hero-shade" />
          <div className="hero-content page-width">
            <span className="eyebrow light"><MapPin size={14} /> Baguio City, Philippines</span>
            <h1>Your Cozy Stay<br />in the Heart of <em>Baguio</em></h1>
            <p>A welcoming base for your time in the City of Pines. Find a room that suits your group and contact the hotel to confirm the details.</p>
            <div className="hero-actions">
              <a className="button button-cream" href="#rooms">Explore our rooms <ArrowRight size={16} /></a>
              <a className="text-link light-link" href="#contact">Inquire about a stay <ArrowUpRight size={16} /></a>
            </div>
          </div>
          <a className="hero-scroll" href="#introduction"><ArrowDown size={15} /> Discover Starwood</a>
          <div className="hero-note"><span>Original concept illustration · Not a hotel photo</span><i /></div>
        </section>

        <section className="intro-section page-width section-pad" id="introduction">
          <div className="intro-kicker">
            <span className="eyebrow">A Baguio address</span>
            <span className="short-rule" />
          </div>
          <div className="intro-copy">
            <h2>A comfortable place<br />to <em>come back to.</em></h2>
            <div className="intro-text">
              <p>Starwood Hotel is located on Kisad Road at the corner of Marcos Highway, near BGH Rotunda in Baguio City. Browse the published room categories and reference rates below, then contact the hotel directly to check current arrangements.</p>
              <a className="text-link" href={hotel.website} target="_blank" rel="noreferrer">
                Visit the official hotel website <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          <div className="intro-facts">
            <div><Clock3 size={18} /><span>Check-in</span><strong>{hotel.checkIn}</strong></div>
            <div><Clock3 size={18} /><span>Check-out</span><strong>{hotel.checkOut}</strong></div>
            <p>Published times; confirm directly with the hotel before your visit.</p>
          </div>
        </section>

        <section className="rooms-section section-pad" id="rooms">
          <div className="page-width">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Make yourself at home</span>
                <h2>Rooms for your<br /><em>Baguio stay.</em></h2>
              </div>
              <p>Explore the published room categories and compare their reference rates. These are not live prices or availability.</p>
            </div>
            <div className="room-controls">
              <label className="select-wrap">
                <UsersRound size={17} aria-hidden="true" />
                <span className="sr-only">Filter rooms by number of adults</span>
                <select value={guestFilter} onChange={(event) => setGuestFilter(event.target.value)}>
                  <option value="any">Any group size</option>
                  <option value="2">2+ adults</option>
                  <option value="4">4+ adults</option>
                  <option value="6">6+ adults</option>
                  <option value="8">8 adults</option>
                </select>
                <ChevronDown size={15} aria-hidden="true" />
              </label>
              <div className="rate-switch" role="group" aria-label="Choose displayed reference rate">
                <span>Reference rates</span>
                <button
                  type="button"
                  className={!peakRates ? 'selected' : ''}
                  aria-pressed={!peakRates}
                  onClick={() => setPeakRates(false)}
                >Regular</button>
                <button
                  type="button"
                  className={peakRates ? 'selected' : ''}
                  aria-pressed={peakRates}
                  onClick={() => setPeakRates(true)}
                >Peak / holiday</button>
              </div>
            </div>
            {visibleRooms.length ? (
              <div className="room-grid">
                {visibleRooms.map((room, index) => (
                  <article className="room-card" key={room.id}>
                    <button className="room-photo-button" type="button" onClick={() => openRoom(room)} aria-label={`View ${room.name} details`}>
                      <Photo src={room.image} alt={room.imageAlt} />
                      <span className="room-index">0{index + 1}</span>
                    </button>
                    <div className="room-card-body">
                      <div className="room-title-row">
                        <h3>{room.name}</h3>
                        <span className="capacity"><UsersRound size={14} /> Up to {room.capacity}</span>
                      </div>
                      <div className="room-card-bottom">
                        <div><small>{peakRates ? 'Peak / holiday reference' : 'Regular reference'} <span>· / night</span></small><strong>{formatPrice(peakRates ? room.peakRate : room.regularRate)}</strong></div>
                        <button className="round-arrow" type="button" aria-label={`Inquire about ${room.name}`} onClick={() => openRoom(room)}>
                          <ArrowUpRight size={18} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <UsersRound size={24} />
                <h3>No room matches that group size</h3>
                <p>Try a smaller group size or contact the hotel directly to ask about options.</p>
                <a className="text-link" href={`tel:+63744465830`}>Call the hotel <ArrowRight size={15} /></a>
              </div>
            )}
            <div className="rate-disclaimer">
              <span>Rate note</span>
              <p>{rateDisclaimer}</p>
              <a href={hotel.ratesSource} target="_blank" rel="noreferrer">View published rates <ArrowUpRight size={14} /></a>
            </div>
          </div>
        </section>

        <section className="facilities-section section-pad" id="amenities">
          <div className="page-width">
            <div className="section-heading facilities-heading">
              <div><span className="eyebrow">Around the hotel</span><h2>Spaces to<br /><em>settle into.</em></h2></div>
              <p>The hotel’s official website features these facilities. Images are illustrative, and current operation or access should be confirmed with the hotel.</p>
            </div>
            <div className="facility-grid">
              {facilities.map((facility, index) => (
                <article className={`facility-card facility-${index + 1}`} key={facility.name}>
                  <Photo src={facility.image.src} alt={facility.image.alt} />
                  <div className="facility-copy"><span>0{index + 1}</span><h3>{facility.name}</h3><p>{facility.description}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="location-section section-pad" id="location">
          <div className="page-width location-layout">
            <div className="location-copy">
              <span className="eyebrow">Find your way</span>
              <h2>In the heart<br />of <em>Baguio.</em></h2>
              <p>{hotel.address}</p>
              <a className="button button-dark" href={hotel.directions} target="_blank" rel="noopener noreferrer">
                Get directions <Compass size={16} />
              </a>
              <div className="location-extra"><MapPin size={16} /><span>Near BGH Rotunda</span></div>
            </div>
            <div className={`map-panel ${mapsEmbedUrl ? 'has-map' : 'has-fallback'}`}>
              {mapsEmbedUrl ? (
                <iframe
                  className="map-iframe"
                  src={mapsEmbedUrl}
                  title="Starwood Hotel Baguio location map"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <div className="map-fallback">
                  <span className="map-fallback-icon"><MapPin size={25} aria-hidden="true" /></span>
                  <span className="eyebrow">Baguio City, Philippines</span>
                  <h3>Find Starwood Hotel Baguio</h3>
                  <p>{hotel.address}</p>
                  <span className="map-fallback-note">Interactive map is not configured. Open Google Maps for the hotel listing and directions.</span>
                  <a className="button button-dark" href={hotel.directions} target="_blank" rel="noopener noreferrer">
                    Open in Google Maps <ArrowUpRight size={16} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="contact-section section-pad" id="contact">
          <div className="page-width contact-inner">
            <div className="contact-copy">
              <span className="eyebrow light">Plan your Baguio visit</span>
              <h2>Questions? Let's<br /><em>talk directly.</em></h2>
              <p>Contact the hotel to confirm availability, current rates, and any details for your stay.</p>
            </div>
            <div className="contact-details">
              <a href={hotel.telephoneHref}><span><Phone size={17} /> Telephone</span><strong>{hotel.telephone}</strong><ArrowUpRight size={16} /></a>
              <a href={hotel.mobileHref}><span><Phone size={17} /> Mobile</span><strong>{hotel.mobile}</strong><ArrowUpRight size={16} /></a>
              <a href={`mailto:${hotel.email}`}><span><Mail size={17} /> Email</span><strong>{hotel.email}</strong><ArrowUpRight size={16} /></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-width footer-main">
          <a className="wordmark footer-wordmark" href="#home">
            <span className="wordmark-icon"><Flower2 size={23} strokeWidth={1.45} /></span>
            <span className="wordmark-copy"><strong>STARWOOD</strong><small>HOTEL · BAGUIO</small></span>
          </a>
          <div className="footer-address"><strong>Visit us</strong><span>{hotel.address}</span><a href={hotel.directions} target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={14} /></a></div>
          <div className="footer-times"><strong>Hotel times</strong><span>Check-in · {hotel.checkIn}</span><span>Check-out · {hotel.checkOut}</span></div>
          <div className="footer-web"><strong>Official website</strong><a href={hotel.website} target="_blank" rel="noreferrer">{hotel.website.replace('https://www.', '')}<ArrowUpRight size={14} /></a></div>
        </div>
        <div className="page-width footer-bottom">
          <p>Independent website redesign concept · Not the official Starwood Hotel website or booking channel.</p>
          <a href="#home">Back to top ↑</a>
        </div>
        <div className="page-width footer-rate-note">{rateDisclaimer}</div>
      </footer>

      <dialog
        className="room-dialog"
        ref={dialogRef}
        aria-labelledby="dialog-title"
        onClose={() => setSelectedRoom(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) closeDialog()
        }}
      >
        <button className="dialog-close icon-button" type="button" onClick={closeDialog} aria-label="Close room details"><X /></button>
        {selectedRoom && (
          <div className="dialog-layout">
            <div className="dialog-intro">
              <Photo src={selectedRoom.image} alt={selectedRoom.imageAlt} />
              <div className="dialog-room-copy">
                <span className="eyebrow">Room details · illustrative photography</span>
                <h2 id="dialog-title">{selectedRoom.name}</h2>
                <p><UsersRound size={16} /> Published capacity: up to {selectedRoom.capacity} adults</p>
                <div className="dialog-rates">
                  <span>Regular reference<strong>{formatPrice(selectedRoom.regularRate)} <small>/ night</small></strong></span>
                  <span>Peak / holiday<strong>{formatPrice(selectedRoom.peakRate)} <small>/ night</small></strong></span>
                </div>
                <p className="dialog-rate-note">{rateDisclaimer}</p>
              </div>
            </div>
            <div className="inquiry-panel">
              {submitted ? (
                <div className="confirmation" role="status">
                  <span className="confirmation-icon"><Check size={22} /></span>
                  <span className="eyebrow">Demo inquiry prepared</span>
                  <h3>No reservation has been made.</h3>
                  <p>This concept does not send or store your information. Contact the hotel to confirm availability and current rates, or open a prefilled email draft below.</p>
                  <a className="button button-dark" href={hotel.telephoneHref}><Phone size={16} /> Call the hotel</a>
                  <a className="text-link" href={emailInquiryHref}>Open prefilled email <ArrowUpRight size={15} /></a>
                  <button className="text-link edit-inquiry" type="button" onClick={() => setSubmitted(false)}>Edit inquiry details</button>
                </div>
              ) : (
                <>
                  <span className="eyebrow">Start a conversation</span>
                  <h3>Inquire about a stay</h3>
                  <p className="form-intro">This demo form stays in your browser and will not send a reservation.</p>
                  <form noValidate onSubmit={submitInquiry}>
                    <div className="form-grid">
                      <label className="field field-full">Room type
                        <select value={roomId} onChange={(event) => {
                          const nextRoom = rooms.find((room) => room.id === event.target.value)
                          setRoomId(event.target.value)
                          if (nextRoom) setSelectedRoom(nextRoom)
                          setErrors((prev) => ({ ...prev, room: undefined }))
                        }} aria-invalid={Boolean(errors.room)} aria-describedby={errors.room ? 'error-room' : undefined}>
                          <option value="" disabled>Select a room</option>
                          {rooms.map((room) => <option key={room.id} value={room.id}>{room.name} · up to {room.capacity} adults</option>)}
                        </select>
                        {errors.room && <span className="field-error" id="error-room">{errors.room}</span>}
                      </label>
                      <label className="field">Check-in
                        <input type="date" value={checkIn} onChange={(event) => { setCheckIn(event.target.value); setErrors((prev) => ({ ...prev, checkIn: undefined, checkOut: undefined })) }} aria-invalid={Boolean(errors.checkIn)} aria-describedby={errors.checkIn ? 'error-checkin' : undefined} />
                        {errors.checkIn && <span className="field-error" id="error-checkin">{errors.checkIn}</span>}
                      </label>
                      <label className="field">Check-out
                        <input type="date" value={checkOut} min={checkIn || undefined} onChange={(event) => { setCheckOut(event.target.value); setErrors((prev) => ({ ...prev, checkOut: undefined })) }} aria-invalid={Boolean(errors.checkOut)} aria-describedby={errors.checkOut ? 'error-checkout' : undefined} />
                        {errors.checkOut && <span className="field-error" id="error-checkout">{errors.checkOut}</span>}
                      </label>
                      <label className="field">Adults
                        <input type="number" min="1" max={chosenRoom?.capacity} step="1" inputMode="numeric" value={adults} onChange={(event) => { setAdults(event.target.value); setErrors((prev) => ({ ...prev, adults: undefined })) }} aria-invalid={Boolean(errors.adults)} aria-describedby={errors.adults ? 'error-adults' : undefined} />
                        {errors.adults && <span className="field-error" id="error-adults">{errors.adults}</span>}
                      </label>
                      <label className="field">Full name
                        <input type="text" autoComplete="name" value={name} onChange={(event) => { setName(event.target.value); setErrors((prev) => ({ ...prev, name: undefined })) }} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'error-name' : undefined} />
                        {errors.name && <span className="field-error" id="error-name">{errors.name}</span>}
                      </label>
                      <label className="field">Email address
                        <input type="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setErrors((prev) => ({ ...prev, email: undefined })) }} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'error-email' : undefined} />
                        {errors.email && <span className="field-error" id="error-email">{errors.email}</span>}
                      </label>
                      <label className="field">Phone <span>(optional)</span>
                        <input type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
                      </label>
                      <label className="field field-full">Message <span>(optional)</span>
                        <textarea rows={3} value={message} onChange={(event) => setMessage(event.target.value)} />
                      </label>
                    </div>
                    <button className="button button-dark submit-button" type="submit" disabled={processing}>
                      {processing ? 'Preparing inquiry…' : 'Review inquiry'} <ArrowRight size={16} />
                    </button>
                    <p className="form-privacy">Nothing is submitted or stored. The next step is to contact the hotel directly.</p>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </dialog>
      <div className="sr-only" aria-live="polite">{visibleRooms.length} room options shown</div>
    </>
  )
}

export default App
