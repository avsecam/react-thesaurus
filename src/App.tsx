import React, { useState } from "react";

const RESULTS_PER_PAGE: number = 10

export default function App() {
	const [userInput, setUserInput] = useState("")
	const [results, setResults] = useState<string[]>([])
	const [resultsPage, setResultsPage] = useState(0)
	const [firstRender, setFirstRender] = useState(true)

	function handleChange(e: React.FormEvent<HTMLInputElement>) {
		setUserInput(e.currentTarget.value)
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		if (firstRender) setFirstRender(false)
		e.preventDefault()
		getResults()
	}

	async function getResults(word: string = userInput) {
		setResults([])
		const synonyms: string[] = await getSynonyms(word)
		setUserInput(word)
		setResultsPage(0)
		setResults(synonyms)
	}

	function canGoToPrevious() {
		return resultsPage > 0
	}

	function canGoToNext() {
		return resultsPage < Math.ceil(results.length / RESULTS_PER_PAGE) - 1
	}

	return (
		<div className="
		w-screen h-screen
		flex justify-around items-center
		bg-slate-900
		">
			<section className="
			h-1/2
			flex flex-col justify-evenly items-center
			">
				<h1 className="
				text-teal-200 text-4xl uppercase
				">
					Thesaurus
				</h1>
				<form onSubmit={handleSubmit}>
					<input id="userInput" type="text" value={userInput} onChange={handleChange} className="
					px-5 py-3
					text-teal-200 bg-transparent border-2 border-teal-200 rounded-full
					transition-all hover:text-fuchsia-400
					"/>
					<input type="submit" className="
					px-6
					text-teal-200 cursor-pointer
					transition-all hover:text-fuchsia-400
					" />
				</form>
				<div className="text-teal-200">Powered by <a href="https://datamuse.com/api/" className="text-fuchsia-300 transition-all hover:text-fuchsia-500">datamuse</a>.</div>
			</section>

			{(results.length > 0) ?
				<section className="
				w-1/4
				">
					<ul>
						{results.slice(resultsPage * RESULTS_PER_PAGE, (resultsPage + 1) * RESULTS_PER_PAGE).map((val, idx) => {
							return (
								<li key={idx}>
									<button onClick={() => getResults(val)} className="
									py-2 w-full
									text-center	text-teal-200
									transition-all
									hover:text-fuchsia-400
									">
										{val}
									</button>
								</li>
							)
						})}
					</ul>
					<div className="
					py-2
					flex justify-around
					">
						<button onClick={canGoToPrevious() ? () => setResultsPage(prev => prev - 1) : undefined} disabled={!canGoToPrevious()} className={`
						w-10 h-10 rounded-full
						border-2 ${canGoToPrevious() ? "border-teal-200 text-teal-200 transition-all hover:text-fuchsia-400 hover:border-fuchsia-400" : "border-gray-400 text-gray-400"}
						`}>
							{"<"}
						</button>
						<button onClick={canGoToNext() ? () => setResultsPage(prev => prev + 1) : undefined} disabled={!canGoToNext()} className={`
						w-10 h-10 rounded-full
						border-2 ${canGoToNext() ? "border-teal-200 text-teal-200 transition-all hover:text-fuchsia-400 hover:border-fuchsia-400" : "border-gray-400 text-gray-400"}
						`}>
							{">"}
						</button>
					</div>
				</section> :
				<div className="
				w-1/4 text-center text-teal-200
				">
					{firstRender ? "Enter a word to get started." : "Loading..."}
				</div>
			}
		</div>
	);
}

async function getSynonyms(word: string) {
	const formattedWord: string = formatWord(word)
	const data = await fetch(`https://api.datamuse.com/words?ml=${formattedWord}`)
		.then(res => res.json())
	const words: string[] = data.map((val: any) => val.word)
	return words
}

function formatWord(word: string) {
	var arr: string[] = [...word]
	for (var idx in arr) {
		if (arr[idx] === " ") {
			arr[idx] = "+"
		}
	}
	return arr.join("")
}