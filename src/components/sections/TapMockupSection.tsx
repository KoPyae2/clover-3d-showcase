import { useRef, useEffect, useCallback } from 'react'
import { SCAN_RESULT_STATIC, useColorStore } from '../../store/useColorStore'
import { setTapTargetRect } from '../../lib/tapTargetRect'

export function TapMockupSection() {
  const { scanTriggered, resetScan, entry, color } = useColorStore()
  const tapTargetRef = useRef<HTMLDivElement>(null)

  const syncTapRect = useCallback(() => {
    const el = tapTargetRef.current
    if (!el) {
      setTapTargetRect(null)
      return
    }
    const r = el.getBoundingClientRect()
    if (r.width < 2 || r.height < 2) {
      setTapTargetRect(null)
      return
    }
    setTapTargetRect({
      left: r.left,
      top: r.top,
      right: r.right,
      bottom: r.bottom,
      width: r.width,
      height: r.height,
    })
  }, [])

  useEffect(() => {
    syncTapRect()
    const ro = new ResizeObserver(syncTapRect)
    const el = tapTargetRef.current
    if (el) ro.observe(el)

    window.addEventListener('scroll', syncTapRect, true)
    window.addEventListener('resize', syncTapRect)

    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', syncTapRect, true)
      window.removeEventListener('resize', syncTapRect)
      setTapTargetRect(null)
    }
  }, [syncTapRect])

  return (
    <section id="section-tap" className="page-section tap reveal" aria-label="Tap demo">
      <div className="tap__grid">
        <div className="tap__phone-wrap">
          <div className="tap__phone-scale">
            <div className="phone phone--16pro">
              <div className="phone__chassis-shadow" aria-hidden />
              <div className="phone__chassis">
                <span className="phone__rail phone__rail--ant" aria-hidden />
                <span className="phone__rail phone__rail--vol-up" aria-hidden />
                <span className="phone__rail phone__rail--vol-down" aria-hidden />
                <span className="phone__rail phone__rail--pwr" aria-hidden />
                <span className="phone__action" aria-hidden />

                <div className="phone__glass">
                  <div className="phone__glass-glare" aria-hidden />

                  <div className="phone__screen">
                    <div className="phone__top">
                      <div className="phone__island" aria-hidden>
                        <span className="phone__island-lens" />
                        <span className="phone__island-grille" />
                      </div>

                      <div
                        ref={tapTargetRef}
                        className="phone__tap-target"
                        data-tap-nfc="true"
                        aria-label="NFC tap target"
                      >
                        {!scanTriggered ? (
                          <>
                            <span className="phone__tap-ring phone__tap-ring--a" />
                            <span className="phone__tap-ring phone__tap-ring--b" />
                            <span className="phone__tap-core" style={{ background: color }} />
                          </>
                        ) : (
                          <span className="phone__tap-core phone__tap-core--ok" style={{ background: color }} />
                        )}
                      </div>
                    </div>

                    <div className="phone__status">
                      <span className="phone__carrier">Clover</span>
                      <span className="phone__pill" style={{ borderColor: color, color }}>
                        {entry.label}
                      </span>
                    </div>

                    {!scanTriggered ? (
                      <div className="phone__hint">
                        <p className="phone__hint-title">Waiting for tap…</p>
                        <p className="phone__hint-sub">
                          Align the keychain with the halo under the notch. Keep it steady for a moment.
                        </p>
                      </div>
                    ) : (
                      <div className="phone__result">
                        <p className="phone__result-badge" style={{ background: color }}>
                          &#x2618; Scanned
                        </p>
                        <p className="phone__result-title">Tag read successfully</p>
                        <dl className="phone__specs">
                          {[...SCAN_RESULT_STATIC, ['UID', entry.nfcUid] as const].map(([k, v]) => (
                            <div key={k} className="phone__spec-row">
                              <dt>{k}</dt>
                              <dd>{v}</dd>
                            </div>
                          ))}
                        </dl>
                        <p className="phone__result-foot">
                          Finish: <strong style={{ color }}>{entry.label}</strong>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tap__copy">
          <p className="tap__eyebrow" style={{ color }}>
            &#x2618; Try it
          </p>
          <h2 className="tap__title">Swing into the tap zone</h2>
          <p className="tap__lead">
            Drag the Clover until the <strong>ring at the top of the charm</strong> sits over the pulsing halo
            under the Dynamic Island — same as the NFC coil on a real iPhone. Hold briefly to register a tap.
          </p>
          <button type="button" className="btn btn--ghost" onClick={() => resetScan()}>
            &#x21bb; Reset tap demo
          </button>
        </div>
      </div>
    </section>
  )
}
