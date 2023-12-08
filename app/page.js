import Image from 'next/image'
import Script from 'next/script'
import Graph from './graphSite/page.js'
import Link from 'next/link'
import './home.css';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <div>
      <img
        src={"/InADizzyCircle.png"}
        width={500}
        height={500}
        id="logo"
      />
      <img
        src={"/GraphAidWords.png"}
        width={500}
        height={500}
        id="wordLogo"
      />
      <h1 id="tagline">Graph Design Made Simple</h1>
      <h2 id="slogan">Your Ideas, Graphically Realized</h2>
      <Link href="/graphSite">
        <button type="button" id="graphSiteLink">Create</button>
      </Link>
      </div>
    </main>
  )
}
