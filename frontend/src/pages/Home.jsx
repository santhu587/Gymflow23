import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const heroRef = useRef(null)
  const bentoRef = useRef(null)
  const featuresRef = useRef(null)

  useEffect(() => {
    try {
      // Ensure all elements are visible first
      if (heroRef.current) {
        heroRef.current.style.opacity = '1'
        heroRef.current.style.visibility = 'visible'
      }
      if (bentoRef.current && bentoRef.current.children) {
        Array.from(bentoRef.current.children).forEach(child => {
          child.style.opacity = '1'
          child.style.visibility = 'visible'
        })
      }
      if (featuresRef.current && featuresRef.current.children) {
        Array.from(featuresRef.current.children).forEach(child => {
          child.style.opacity = '1'
          child.style.visibility = 'visible'
        })
      }

      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        try {
          // Hero fade-in animation
          if (heroRef.current) {
            gsap.from(heroRef.current, {
              opacity: 0,
              y: 30,
              duration: 1.2,
              ease: 'power3.out',
            })
          }

          // Bento grid stagger animation
          if (bentoRef.current && bentoRef.current.children && bentoRef.current.children.length > 0) {
            gsap.from(bentoRef.current.children, {
              opacity: 0,
              y: 50,
              duration: 1,
              stagger: 0.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: bentoRef.current,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
            })
          }

          // Features scroll animation
          if (featuresRef.current && featuresRef.current.children && featuresRef.current.children.length > 0) {
            gsap.from(featuresRef.current.children, {
              opacity: 0,
              x: -50,
              duration: 1,
              stagger: 0.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: featuresRef.current,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
            })
          }
        } catch (error) {
          console.error('GSAP animation error:', error)
          // Ensure visibility even if animation fails
          if (heroRef.current) heroRef.current.style.opacity = '1'
          if (bentoRef.current && bentoRef.current.children) {
            Array.from(bentoRef.current.children).forEach(child => {
              child.style.opacity = '1'
            })
          }
          if (featuresRef.current && featuresRef.current.children) {
            Array.from(featuresRef.current.children).forEach(child => {
              child.style.opacity = '1'
            })
          }
        }
      }, 100)

      return () => {
        clearTimeout(timer)
        try {
          if (ScrollTrigger && ScrollTrigger.getAll) {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
          }
        } catch (error) {
          console.error('ScrollTrigger cleanup error:', error)
        }
      }
    } catch (error) {
      console.error('Home useEffect error:', error)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#1d1d1f' }}>
      {/* Glassmorphism Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                <span className="text-base sm:text-lg">💪</span>
              </div>
              <span className="apple-body font-semibold text-gray-900 text-sm sm:text-base">GymFlow</span>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-6">
              <Link
                to="/login"
                className="apple-body text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="apple-button apple-button-primary text-sm sm:text-base px-3 sm:px-4"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-16 sm:pt-20 pb-8"
      >
        <div className="text-center max-w-4xl">
          <h1 className="apple-hero gradient-text mb-4 sm:mb-6 text-3xl sm:text-4xl lg:text-5xl">
            Transform Your
            <br />
            <span className="text-gray-900">Gym Business</span>
          </h1>
          <p className="apple-subhead mb-8 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-base px-4">
            Manage members, trainers, payments, and more with our powerful, intuitive platform.
            Everything you need in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
            <Link
              to="/register"
              className="apple-button apple-button-primary"
            >
              Start Free Trial
            </Link>
            <Link
              to="/login"
              className="apple-button apple-button-secondary"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6" style={{ minHeight: 'auto' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="apple-headline text-center mb-8 sm:mb-12 lg:mb-16 text-2xl sm:text-3xl lg:text-4xl">Everything You Need</h2>
          <div ref={bentoRef} className="bento-grid" style={{ opacity: 1 }}>
            <div className="bento-card p-6 sm:p-8 lg:p-12 col-span-1 lg:col-span-2">
              <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6">👥</div>
              <h3 className="apple-headline text-xl sm:text-2xl mb-3 sm:mb-4">Member Management</h3>
              <p className="apple-body text-gray-600 text-sm sm:text-base">
                Track members, plans, and expiry dates effortlessly. Get real-time insights into your membership base.
              </p>
            </div>
            <div className="bento-card p-6 sm:p-8 lg:p-12">
              <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6">💰</div>
              <h3 className="apple-headline text-xl sm:text-2xl mb-3 sm:mb-4">Payment Tracking</h3>
              <p className="apple-body text-gray-600 text-sm sm:text-base">
                Record payments, track outstanding dues, and manage revenue with comprehensive financial reports.
              </p>
            </div>
            <div className="bento-card p-6 sm:p-8 lg:p-12">
              <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6">🏋️</div>
              <h3 className="apple-headline text-xl sm:text-2xl mb-3 sm:mb-4">Trainer Management</h3>
              <p className="apple-body text-gray-600 text-sm sm:text-base">
                Manage trainers, schedules, and payments. Keep track of trainer performance and commissions.
              </p>
            </div>
            <div className="bento-card p-6 sm:p-8 lg:p-12 col-span-1 lg:col-span-2">
              <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6">📊</div>
              <h3 className="apple-headline text-xl sm:text-2xl mb-3 sm:mb-4">Analytics Dashboard</h3>
              <p className="apple-body text-gray-600 text-sm sm:text-base">
                Get comprehensive insights into your gym's performance with real-time analytics and visual reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features List */}
      <section ref={featuresRef} className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 bg-gray-50" style={{ opacity: 1 }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="apple-headline text-center mb-12 sm:mb-16 lg:mb-20 text-2xl sm:text-3xl lg:text-4xl">Why Choose GymFlow</h2>
          <div className="space-y-12">
            <FeatureItem
              number="01"
              title="Intuitive Interface"
              description="Designed with simplicity in mind. Every feature is just a click away."
            />
            <FeatureItem
              number="02"
              title="Real-time Updates"
              description="See changes instantly. No page refreshes needed."
            />
            <FeatureItem
              number="03"
              title="Secure & Reliable"
              description="Your data is protected with enterprise-grade security."
            />
            <FeatureItem
              number="04"
              title="24/7 Support"
              description="We're here to help whenever you need us."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center glass-card rounded-[30px] sm:rounded-[40px] lg:rounded-[50px] p-8 sm:p-12 lg:p-16">
          <h2 className="apple-headline mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-4xl">Ready to Get Started?</h2>
          <p className="apple-subhead mb-8 sm:mb-12 text-sm sm:text-base">
            Join thousands of gym owners who trust GymFlow to manage their business.
          </p>
          <Link
            to="/register"
            className="apple-button apple-button-primary inline-block"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 sm:space-y-4">
            <p className="apple-body text-gray-500 text-sm sm:text-base">
              &copy; 2025 GymFlow. All rights reserved.
            </p>
            <div className="flex items-center justify-center">
              <p className="apple-body text-xs sm:text-sm text-gray-500">
                Design and Developed by <span className="font-medium text-gray-700">Santhosh Chandra</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureItem({ number, title, description }) {
  return (
    <div className="flex items-start space-x-4 sm:space-x-6 lg:space-x-8">
      <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-200 flex-shrink-0">{number}</div>
      <div>
        <h3 className="apple-headline text-xl sm:text-2xl lg:text-3xl mb-2 sm:mb-3">{title}</h3>
        <p className="apple-body text-gray-600 text-sm sm:text-base">{description}</p>
      </div>
    </div>
  )
}
