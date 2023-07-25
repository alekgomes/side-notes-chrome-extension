import AwesomeDebouncePromise from "awesome-debounce-promise"
import { Note } from "./types"
import { useLayoutEffect, useState } from "preact/hooks"
import { styled } from "styled-components"
import {
  theme,
  SaguGlobalStyles,
  SaguProvider,
  Box,
  Heading,
  Button,
  Divider,
  wine,
  TextContent,
  Ribbon,
  TextField,
} from "sagu-ui"

Object.assign(theme.colors, wine)

const StyledMain = styled.main`
  width: 520px;
`

const StyledListItem = styled.li`
  cursor: pointer;
`

const formatedDate = (date: Date) => new Intl.DateTimeFormat().format(date)

export function App() {
  const [notes, setNotes] = useState({})
  const [inputValue, setInputValue] = useState("")

  const requestNotes = () => {
    chrome.storage.local.get(function (result) {
      setNotes(result)
    })
  }

  useLayoutEffect(() => {
    requestNotes()
  }, [])

  const handleNoteDelete = (note: Note) => {
    const key = note.origin
    chrome.storage.local.get(function (result) {
      const notesArray = result[key]
      const filteredNotes = notesArray.filter(
        (currNote) => currNote.date !== note.date
      )

      chrome.storage.local.set({ [key]: filteredNotes }).then(() => {
        requestNotes()
      })

      // TODO REMOVE HIGHLIGHT
    })
  }

  const handleNavigation = (event: Event, note: Note): void => {
    event.preventDefault()
    const key = note.origin

    chrome.storage.local.get(function (result) {
      const notesArray = result[key]

      const newNotes = notesArray.map((currNote) => {
        if (currNote.date == note.date) {
          currNote.clicked = true
        }
        return currNote
      })

      chrome.storage.local.set({ [key]: newNotes }).then(() => {
        window.open(note.url, "_blank", "noreferrer")
      })

      // TODO REMOVE HIGHLIGHT
    })

    // setar note.clicked = true
  }

  // const handleInputChange = (e: any): void => {
  //   const prevNotes = notes
  //   setInputValue(e.target.value)

  //   const filterByOrigin = (inputValue: String) =>
  //     notes.filter((note: any) => note.origin.includes(inputValue))

  //   const debouncedRequestFilteredData = AwesomeDebouncePromise(
  //     filterByOrigin,
  //     250
  //   )

  //   console.log(debouncedRequestFilteredData)
  // }

  console.log("notes: ", notes)
  return (
    <SaguProvider theme={theme}>
      <SaguGlobalStyles />
      <StyledMain>
        <Box
          flex="column"
          gap="xsmall"
          border
          shadow
          padding="medium"
          fullWidth
        >
          <Ribbon>Beta</Ribbon>
          <Heading lineLeft lineColor="secondary" size="huge">
            Side Notes
          </Heading>
          <Divider />

          {/* <Box padding="xxsmall" fullWidth>
            <TextField
              label="Filter by origin"
              value={inputValue}
              onChange={handleInputChange}
              s
            />
          </Box> */}

          <ul>
            {Object.values(notes).flat().length ? (
              Object.values(notes)
                .flat()
                .map((note) => (
                  <StyledListItem>
                    <Box
                      flex="row"
                      gap="xxsmall"
                      padding="xxsmall"
                      alignment="center"
                      justify="space-between"
                      fullWidth
                    >
                      <Box
                        onClick={(e: Event) => handleNavigation(e, note)}
                        fullWidth
                        padding="none"
                      >
                        <TextContent
                          tag="p"
                          size="small"
                          padding="none"
                          role="navigation"
                          value={note.content}
                        />
                        <Box
                          flex="row"
                          fullWidth
                          padding="none"
                          justify="space-between"
                          style={{ height: "min-content" }}
                        >
                          <TextContent
                            tag="small"
                            size="xsmall"
                            value={note.origin}
                          />
                          <TextContent
                            tag="small"
                            size="xsmall"
                            value={formatedDate(note.date)}
                          />
                        </Box>
                      </Box>
                      <Button
                        variant="filled"
                        padding="mini"
                        size="xsmall"
                        onClick={() => handleNoteDelete(note)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </StyledListItem>
                ))
            ) : (
              <TextContent value="There is no note..." />
            )}
          </ul>
          <Box
            padding="xxsmall"
            fullWidth
            style={{
              height: "min-content",
              textAlign: "right",
            }}
          >
            <TextContent
              tag="i"
              color="black"
              value="Powered by Sagu-UI"
              size="xsmall"
            />
          </Box>
        </Box>
      </StyledMain>
    </SaguProvider>
  )
}
