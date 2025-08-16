import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';

/**
 * Reusable 404 Error Component
 * Because getting lost should be fun! 🎪
 *
 * This component contains the shared 404 logic and UI that can be used
 * by both the theme NotFound component and the pages 404 component.
 */
export default function Custom404Component(): React.JSX.Element {
  const [excuse, setExcuse] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [catFact, setCatFact] = useState('');

  // Ridiculous excuses for the missing page
  const excuses = [
    '🐕 A dog ate the page (it was very tasty HTML)',
    '🧙‍♂️ A wizard turned it into a toad',
    '🛸 Aliens abducted it for their intergalactic library',
    '🍕 It went out to get pizza and never came back',
    '🕳️ It fell into a parallel dimension',
    '🏴‍☠️ Pirates stole it for their treasure map collection',
    '🤖 A robot uprising deleted it out of spite',
    '🦄 A unicorn needed it to practice magic tricks',
    '🧻 Someone used it as toilet paper during the Great TP Shortage of 2020',
    '🎭 It joined the circus as a trapeze artist',
    '🧟‍♂️ Zombies ate it (they prefer semantic HTML)',
    '🐉 A dragon is hoarding it with other precious documents',
    "🥸 It's in witness protection after seeing too much JavaScript",
    '🕰️ It time-traveled to 1999 and got stuck',
    '🎪 It ran away to join the circus with the other missing socks'
  ];

  const catFacts = [
    'Cats spend 70% of their lives sleeping, which explains why your page is taking a nap.',
    "A group of cats is called a 'clowder,' which is also what we call our development team.",
    "Cats can't taste sweetness, unlike this bitter 404 experience.",
    'Cats have five toes on their front paws but only four on their back paws, unlike this page which has zero paws.',
    'Cats purr at 26 vibrations per second, which is coincidentally how fast our server is running right now.'
  ];

  // Rotate excuses every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setExcuse((prev) => (prev + 1) % excuses.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [excuses.length]);

  // Load a random cat fact
  useEffect(() => {
    setCatFact(catFacts[Math.floor(Math.random() * catFacts.length)]);
  }, []);

  const handleSpinClick = () => {
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 1000);
    setCatFact(catFacts[Math.floor(Math.random() * catFacts.length)]);
  };

  return (
    <div className="container margin-top--lg">
      <div className="row">
        <div className="col col--10 col--offset-1">
          {/* Main Error Display */}
          <div className="text--center margin-bottom--xl">
            <div
              style={{
                fontSize: '8rem',
                lineHeight: '1',
                marginBottom: '1rem'
              }}
            >
              <span
                style={{
                  background:
                    'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #f7b731)',
                  backgroundSize: '400% 400%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'rainbow 3s ease infinite'
                }}
              >
                404
              </span>
            </div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              🎪 OOPS! PAGE WENT TO WONDERLAND! 🎪
            </h1>
            <p
              style={{
                fontSize: '1.2rem',
                maxWidth: '600px',
                margin: '0 auto 2rem'
              }}
            >
              The page you're looking for has mysteriously vanished into the
              digital abyss. But don't worry, we have a team of highly trained
              rubber ducks investigating the situation!
            </p>
          </div>

          {/* Excuse Generator */}
          <div
            className="card shadow--md margin-bottom--xl"
            style={{ textAlign: 'center' }}
          >
            <div className="card__header">
              <h3>🎭 Official Excuse Generator™</h3>
              <p>Here's why your page is missing (updated every 3 seconds):</p>
            </div>
            <div className="card__body">
              <div
                style={{
                  fontSize: '1.3rem',
                  minHeight: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.5s ease',
                  backgroundColor: 'var(--ifm-color-emphasis-100)',
                  borderRadius: '8px',
                  padding: '1rem'
                }}
              >
                {excuses[excuse]}
              </div>
            </div>
          </div>

          {/* Cat Facts and Navigation */}
          <div className="row margin-bottom--xl">
            <div className="col col--6">
              <div className="card shadow--tl">
                <div className="card__header">
                  <h3>🎰 Spin for Cat Facts!</h3>
                </div>
                <div className="card__body text--center">
                  <button
                    className="button button--primary button--lg margin-bottom--md"
                    onClick={handleSpinClick}
                    style={{
                      transform: isSpinning ? 'rotate(360deg)' : 'none',
                      transition: 'transform 1s ease'
                    }}
                  >
                    🐱 SPIN FOR WISDOM!
                  </button>
                  <p
                    style={{
                      minHeight: '4rem',
                      fontSize: '1rem',
                      fontStyle: 'italic'
                    }}
                  >
                    {catFact}
                  </p>
                </div>
              </div>
            </div>
            <div className="col col--6">
              <div className="card shadow--tl">
                <div className="card__header">
                  <h3>🚀 Emergency Navigation</h3>
                </div>
                <div className="card__body">
                  <p>Don't panic! Here are some safe havens:</p>
                  <div className="button-group button-group--block">
                    <Link className="button button--secondary" to="/">
                      🏠 Go Home
                    </Link>
                    <Link className="button button--secondary" to="/docs">
                      📚 Read Docs
                    </Link>
                    <Link className="button button--secondary" to="/demos">
                      🎮 Try Demos
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Troubleshooting Steps */}
          <div className="card shadow--md margin-bottom--xl">
            <div className="card__header">
              <h3>🛠️ Troubleshooting Steps (Not Guaranteed to Work)</h3>
            </div>
            <div className="card__body">
              <div className="row">
                <div className="col col--6">
                  <h4>🔧 Technical Solutions:</h4>
                  <ul>
                    <li>
                      Turn it off and on again (the internet, not your computer)
                    </li>
                    <li>
                      Blow into the URL bar like it's a Nintendo cartridge
                    </li>
                    <li>Try typing the URL in Comic Sans font</li>
                    <li>Ask your rubber duck for debugging advice</li>
                    <li>Sacrifice a USB cable to the tech gods</li>
                  </ul>
                </div>
                <div className="col col--6">
                  <h4>🎪 Creative Solutions:</h4>
                  <ul>
                    <li>
                      Draw the page on paper and hold it up to your screen
                    </li>
                    <li>Try accessing it from a parallel universe</li>
                    <li>Bribe your browser with cookies (the edible kind)</li>
                    <li>Perform an interpretive dance to summon the page</li>
                    <li>Check if the page is hiding behind your monitor</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="row margin-bottom--xl">
            <div className="col col--4">
              <div className="card shadow--tl text--center">
                <div className="card__body">
                  <div style={{ fontSize: '3rem' }}>🔍</div>
                  <h4>Pages Found Today</h4>
                  <div
                    style={{
                      fontSize: '2rem',
                      color: 'var(--ifm-color-primary)'
                    }}
                  >
                    {Math.floor(Math.random() * 1000) + 500}
                  </div>
                  <small>This one wasn't one of them</small>
                </div>
              </div>
            </div>
            <div className="col col--4">
              <div className="card shadow--tl text--center">
                <div className="card__body">
                  <div style={{ fontSize: '3rem' }}>🤖</div>
                  <h4>Robots Consulted</h4>
                  <div
                    style={{
                      fontSize: '2rem',
                      color: 'var(--ifm-color-primary)'
                    }}
                  >
                    {Math.floor(Math.random() * 100) + 10}
                  </div>
                  <small>They're as confused as you are</small>
                </div>
              </div>
            </div>
            <div className="col col--4">
              <div className="card shadow--tl text--center">
                <div className="card__body">
                  <div style={{ fontSize: '3rem' }}>☕</div>
                  <h4>Coffee Consumed</h4>
                  <div
                    style={{
                      fontSize: '2rem',
                      color: 'var(--ifm-color-primary)'
                    }}
                  >
                    {Math.floor(Math.random() * 20) + 5} cups
                  </div>
                  <small>By our developers while fixing this</small>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div
            className="text--center padding--lg"
            style={{
              backgroundColor: 'var(--ifm-color-emphasis-100)',
              borderRadius: '8px'
            }}
          >
            <h3>🎨 Did you enjoy this 404 page?</h3>
            <p>
              If this error page brought you joy, imagine how amazing our actual
              content is! While you're here, why not check out our{' '}
              <Link to="/demos">component demos</Link> or dive into the{' '}
              <Link to="/docs">documentation</Link>?
            </p>
            <p
              style={{
                fontSize: '0.9rem',
                fontStyle: 'italic',
                marginTop: '1rem'
              }}
            >
              <strong>Fun Fact:</strong> You're the{' '}
              {Math.floor(Math.random() * 5000) + 1000}th person to visit this
              404 page today! 🎉 (This number is completely made up)
            </p>
          </div>

          {/* CSS Styles */}
          <style>
            {`
              @keyframes rainbow {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
            `}
          </style>
        </div>
      </div>
    </div>
  );
}
