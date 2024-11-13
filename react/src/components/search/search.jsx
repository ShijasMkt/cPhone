import React from 'react'

export default function Search() {
	const [isSearch, setIsSearch] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [searchList, setSearchList] = useState([]);
	const [isResult, setResult] = useState(false);
	const handleBlur = () => {
		setIsFocused(false);
		setResult(false);
	};
	const handleFocus = () => {
		setIsFocused(true);
	};
	const searchResult = () => {
		const results = phones.filter((phone) =>
			phone.name.toLowerCase().includes(searchValue.toLowerCase())
		);
		if (results) {
			setResult(true);
		}
		setSearchList(results);
	};
	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			document.getElementById("searchBox").blur();
			document.getElementById("searchIcon").click();
		}
	};
  return (
	<div>
	  <div
	id="search-box"
	className={` d-flex ${isFocused ? "search-bar-box-focus" : "search-bar-box"}`}
	onFocus={handleFocus}
	onBlur={handleBlur}
>
	<input
		id="searchBox"
		value={searchValue}
		className="search-bar"
		type="search"
		placeholder="Search any product..."
		onChange={(e) => setSearchValue(e.target.value)}
		onFocus={() => setIsSearch(true)}
		onBlur={() => setIsSearch(false)}
		onKeyDown={handleKeyPress}
	/>
	<span
		id="searchIcon"
		onClick={searchResult}
		className="material-symbols-outlined search-bar-icon"
	>
		search
	</span>
</div>
	</div>
  )
}



