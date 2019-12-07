Various scripts to scrape RepeaterBook for repeaters, store them, process them, and generate CSVs.

Output available in Chirp and Yaesu format.

Node code developed on macOS and Windows 10.

Node version v12.13.1, npm version 6.12.1

Python code developed on Windows 10.

Python version 3.8.0 x64

generate-frequencies: Create a set of simplex frequencies based on ranges
defined by the ARRL and Colorado Council of Amateur Radio Clubs.

get-repeaters: Crawl and scrape repeaters from RepeaterBook and cache them locally.

convert-repeaters: Convert from "raw" HTML-JSON dump to a common JSON format.

make-chirp: Generate Chirp CSVs from common JSON.

make-yaesu: Generate Yaesu CSVs from common JSON.

combine: Deprecated, mostly replaced with convert-repeaters.

group-by: Needs to be updated, but would group and sort repeaters by name or frequency or another parameter.
