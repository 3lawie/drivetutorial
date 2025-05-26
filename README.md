# to learn:
 - Link
 
#theo infos:
 - Link built in component udate using js on client side [a will re-render then refetch the json to check for re-routing[useful for reload]]

#code enhance:
 - v0 for file[link] glitch
# Drive Tuturial

##TODO

- [x] set up database and data model
- [x] Move folder open state to URL
- [x] Add auth
- [ ] Add file uploading 
- [ ] Add analytics

## Note from 1-4-2025 [34:00]
just finished connection database, next steps: 

- [x] update Schema to show files and folders
- [x] MAnually insert examples
- [x] Render them in the UI
- [ ] Push and make sure it all works[netlify]

## Note from 13-5-2025

- [x] change folders to links components, remove all client states
- [ ] Clean up database and data fetching patterns
- [ ] real homepage
- {" 2:3:29 check netlify error in chat also"}

## 15-5-2025
- [x] Add ownership to files and folders
- [x] Upload files to the right folder
- [ ] Delete files button
- [x] Allow files that aren't images to be uploaded
- [ ] Real homepage
- {2:31:11 complete seed function}

## 16-5-2025
- [ ] Add analytics
- [ ] Add delete file
- [ ] Real HomePage + onBoarding

## 17-52025
- rewrite the proxy reverse methods and differences between dev and prod 
   theo search for deploying posthog with netlify which found a common with deploying
    post hog with netlify because of netlify wrapper, a netlify.toml can help 
     solve the problem he found in the posthog docs to solve it instead of 
      original rewrites
- [x] Make sure events are persisting as expected
- [x] Make sure sort order is consistent 

## 18-5-2025
- [x] Update database for UploadThing file Key
- [x] update deletion for files and refresh by custom cookie
- [x] Add analytics
- [x] Add delete file

## 19-5-2025
- [x] Real Homepage + onBoarding


-- HomeWorks:
- Folder deletion 
- Folder creation
- Folder rename
- access Control[ownerId checks]
- make file view page[self rendering]
- toasts[loading]
- Gray out a row while it being deleted
- file types storage
