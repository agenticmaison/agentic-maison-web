import { salesDemo, ui } from '@/lib/chateau/content';

/**
 * The Sales Ops Agent demonstration: a non-interactive, selectable HTML
 * illustration of a Telegram chat on a phone. There are no pretend controls.
 * In the tour the agent reply's opacity follows the `--reply` custom
 * property set by the scroll position on the tracked plane.
 */
export function SalesPhone() {
  return (
    <div className="ch-phone" role="group" aria-label={`${salesDemo.appTitle}, ${ui.demoLabel}`}>
      <div className="ch-phone-screen">
        <div className="ch-phone-notch" aria-hidden />
        <div className="ch-phone-head">
          <div className="ch-phone-avatar" aria-hidden>
            SO
          </div>
          <div>
            <div className="ch-phone-title">{salesDemo.appTitle}</div>
            <div className="ch-phone-sub">{ui.demoLabel}</div>
          </div>
        </div>
        <div className="ch-phone-body">
          <p className="ch-bubble ch-bubble--user">{salesDemo.user}</p>
          <p className="ch-bubble ch-bubble--agent">
            {salesDemo.agent}
            <span className="ch-bubble-source">{salesDemo.source}</span>
          </p>
        </div>
        <div className="ch-phone-foot">{ui.demoLabel}</div>
      </div>
    </div>
  );
}
