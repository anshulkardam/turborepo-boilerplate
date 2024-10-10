import { Counter } from "./components/counter";

export default function Home() {
  return (
    <div>
      <div className="text-6xl text-red-600">hi there
        <div>
          <Counter />
        </div>
      </div>
      <Counter />
    </div>
  )
}