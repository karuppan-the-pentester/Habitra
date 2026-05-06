/* Home page bootstrap */
const seed = JSON.parse(document.getElementById("habitra-seed").textContent);

const heroRoot = ReactDOM.createRoot(document.getElementById("hero-demo"));
const fullRoot = ReactDOM.createRoot(document.getElementById("full-demo"));

function HomeShell() {
  const [habits, setHabits] = React.useState(seed);
  useReveal();

  function toggle(id) {
    setHabits(hs => hs.map(h => h.id === id
      ? { ...h, done: !h.done, streak: !h.done ? h.streak + 1 : Math.max(0, h.streak - 1) }
      : h));
  }

  React.useEffect(() => {
    heroRoot.render(<HabitraPreview habits={habits.slice(0, 4)} onToggle={toggle} compact={true} />);
    fullRoot.render(<HabitraPreview habits={habits} onToggle={toggle} />);
  }, [habits]);

  return <NavBar active="home" />;
}

ReactDOM.createRoot(document.getElementById("nav-root")).render(<HomeShell />);
ReactDOM.createRoot(document.getElementById("footer-root")).render(<SiteFooter />);
