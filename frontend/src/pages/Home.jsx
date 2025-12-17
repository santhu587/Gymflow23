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
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                <span className="text-lg">💪</span>
              </div>
              <span className="apple-body font-semibold text-gray-900">GymFlow</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                to="/login"
                className="apple-body text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="apple-button apple-button-primary"
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
        className="min-h-screen flex items-center justify-center px-6 pt-20"
      >
        <div className="text-center max-w-4xl">
          <h1 className="apple-hero gradient-text mb-6">
            Transform Your
            <br />
            <span className="text-gray-900">Gym Business</span>
          </h1>
          <p className="apple-subhead mb-12 max-w-2xl mx-auto">
            Manage members, trainers, payments, and more with our powerful, intuitive platform.
            Everything you need in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
      <section className="py-32 px-6" style={{ minHeight: 'auto' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="apple-headline text-center mb-16">Everything You Need</h2>
          <div ref={bentoRef} className="bento-grid" style={{ opacity: 1 }}>
            <div className="bento-card p-12 col-span-1 md:col-span-2">
              <div className="text-6xl mb-6">👥</div>
              <h3 className="apple-headline text-2xl mb-4">Member Management</h3>
              <p className="apple-body text-white/60">
                Track members, plans, and expiry dates effortlessly. Get real-time insights into your membership base.
              </p>
            </div>
            <div className="bento-card p-12">
              <div className="text-6xl mb-6">💰</div>
              <h3 className="apple-headline text-2xl mb-4">Payment Tracking</h3>
              <p className="apple-body text-white/60">
                Record payments, track outstanding dues, and manage revenue with comprehensive financial reports.
              </p>
            </div>
            <div className="bento-card p-12">
              <div className="text-6xl mb-6">🏋️</div>
              <h3 className="apple-headline text-2xl mb-4">Trainer Management</h3>
              <p className="apple-body text-white/60">
                Manage trainers, schedules, and payments. Keep track of trainer performance and commissions.
              </p>
            </div>
            <div className="bento-card p-12 col-span-1 md:col-span-2">
              <div className="text-6xl mb-6">📊</div>
              <h3 className="apple-headline text-2xl mb-4">Analytics Dashboard</h3>
              <p className="apple-body text-white/60">
                Get comprehensive insights into your gym's performance with real-time analytics and visual reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features List */}
      <section ref={featuresRef} className="py-32 px-6 bg-gray-50" style={{ opacity: 1 }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="apple-headline text-center mb-20">Why Choose GymFlow</h2>
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
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center glass-card rounded-[50px] p-16">
          <h2 className="apple-headline mb-6">Ready to Get Started?</h2>
          <p className="apple-subhead mb-12">
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
      <footer className="py-12 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4">
            <p className="apple-body text-gray-500">
              &copy; 2025 GymFlow. All rights reserved.
            </p>
            <div className="flex items-center justify-center space-x-2">
              <p className="apple-body text-sm text-gray-400">Design & Development by</p>
              <a
                href="https://sansatechsolution.com"
                target="_blank"
                rel="noopener noreferrer"
                className="apple-body text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
              >
                SansaTechSolution.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureItem({ number, title, description }) {
  return (
    <div className="flex items-start space-x-8">
      <div className="text-6xl font-bold text-gray-200">{number}</div>
      <div>
        <h3 className="apple-headline text-3xl mb-3">{title}</h3>
        <p className="apple-body text-gray-600">{description}</p>
      </div>
    </div>
  )
}
