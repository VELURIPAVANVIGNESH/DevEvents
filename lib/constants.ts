export type Event = {
  id: string;
  title: string;
  image: string;
  slug?: string;
  location?: string;
  date?: string; // ISO or human-readable
  time?: string;
  description?: string;
  url?: string;
};

export const events: Event[] = [
  {
    id: "react-summit-2026",
    title: "React Summit 2026",
    image: "/images/event1.png",
    slug: "react-summit-2026",
    location: "Amsterdam, Netherlands",
    date: "2026-04-09",
    time: "09:00 CEST",
    description: "A two-day conference focused on the React ecosystem, state management, performance and React Native case studies.",
    url: "https://reactsummit.com/",
  },
  {
    id: "nextjs-conf-2026",
    title: "Next.js Conf 2026",
    image: "/images/event2.png",
    slug: "nextjs-conf-2026",
    location: "San Francisco, CA, USA",
    date: "2026-06-16",
    time: "10:00 PDT",
    description: "Official Next.js conference with product talks, workshops and an ecosystem showcase.",
    url: "https://nextjs.org/conf",
  },
  {
    id: "jsconf-eu-2026",
    title: "JSConf EU 2026",
    image: "/images/event3.png",
    slug: "jsconf-eu-2026",
    location: "Berlin, Germany",
    date: "2026-05-21",
    time: "09:30 CEST",
    description: "European JavaScript conference covering language features, tooling, and web performance.",
    url: "https://jsconf.eu/",
  },
  {
    id: "google-io-2026",
    title: "Google I/O 2026",
    image: "/images/event4.png",
    slug: "google-io-2026",
    location: "Mountain View, CA, USA",
    date: "2026-05-12",
    time: "10:00 PDT",
    description: "Google's annual developer conference — platform updates, cloud, mobile and AI announcements.",
    url: "https://io.google/",
  },
  {
    id: "hack-the-planet-2026",
    title: "Hack The Planet 2026 (Global Hackathon)",
    image: "/images/event5.png",
    slug: "hack-the-planet-2026",
    location: "Remote / Global",
    date: "2026-03-20",
    time: "All-day",
    description: "48-hour global hackathon for builders working on open-source, climate-tech and civic projects.",
    url: "https://hacktheplanet.example/",
  },
  {
    id: "pycon-2026",
    title: "PyCon US 2026",
    image: "/images/event6.png",
    slug: "pycon-2026",
    location: "Austin, TX, USA",
    date: "2026-04-21",
    time: "09:00 CDT",
    description: "The largest annual gathering for the Python community — talks, sprints and tutorials.",
    url: "https://us.pycon.org/",
  },
  {
    id: "dev-local-meetup",
    title: "Developer Community Meetup",
    image: "/images/event-full.png",
    slug: "dev-local-meetup",
    location: "Local Tech Hub",
    date: "2026-01-15",
    time: "18:30",
    description: "Monthly meetup for developers to demo projects, exchange tips and network.",
    url: "https://example.com/local-meetup",
  }
];

export default events;
