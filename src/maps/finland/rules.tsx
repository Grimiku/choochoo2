export function FinlandRules() {
  return (
    <div>
      <p>Same as base game with the following changes:</p>
      <ul>
        <li>
          <b>Impassable terrain:</b> no connection can pass through red borders.
        </li>
        <li>
          <b>Espoo-Helsinki-Vantaa:</b> those three cities are linked internally with public transport connections. Goods can move between them via public transport connections, however using them does not grant any income. 
        </li>
        <li>
          <b>Russia:</b> accepts all colors of goods for delivery and starts with 5 good cubes. When performing a delivery to Russia a random cube is removed from that hex. If Russia becomes empty, goods can no longer be delivered there. You cannot build a link starting from Russia, only towards it.
        </li>
        <li>
          <b>Sweden:</b> accepts all colors of goods for delivery. You cannot deliver to Sweden unless one of the players reaches Loco 4. At that moment 5 good cubes visible near Sweden hex are moved onto it. When performing a delivery to Sweden a random cube is removed from that hex. If Sweden becomes empty, goods can no longer be delivered there. You cannot build a link starting from Sweden, only towards it.
        </li>
      </ul>
    </div>
  );
}
