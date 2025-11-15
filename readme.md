Here in Vorarlberg Austria, we have portable food stands that sell rosted chickens that are available on some days, mostly in front of supermarkets.

I've made a website a view years ago, that basically consisted of a big map with markers, that pointed to the location of these stands. When clicking on a marker, there was a tooltip showing the name of the place, the adress, and on which days of the week the stand will be there. In the side nav there was basically just a image, a bit of text and most importantly a filter where the user can select which days he wants to see, which then filtered the pins on the map. If you can you look at it here http://halbe-henn.at.

What I want to do is redo this website with a bit of a more modern design.

Help me think through how to break this into iterative pieces and write a plan.md

Requirements:

- Fullscreen Map view with pointers showing all the available stands
- Tooltip/Popover when clicking on each pointer, showing info like the name of the supermarket, the adress,
  and the days of the week the stand is available there
- Some kind of side navigation that is overlayed on top of the map where the days can be filtered. Default filtering should be on the current day.
- Add unit tests for business logic, e2e tests for core user journies
- Use git and bun package manager, use descriptive commits

Design:

- Minimal, functional, practical
- Use shadcn
- Use tailwind
- Dark/light mode should be available

Techstack:

- Next.js
- No need for any api or database since we can just use the old json file I've been using as a datasource for all stands
