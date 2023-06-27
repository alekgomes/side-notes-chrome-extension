import AwesomeDebouncePromise from "awesome-debounce-promise"

import { useLayoutEffect, useState } from "preact/hooks"
import { styled } from "styled-components"
import { Note } from "./types"
import { deleteNote, getAllNotes, getFilteredNotes } from "./indexedDb"
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
  const [notes, setNotes] = useState([])
  const [inputValue, setInputValue] = useState("")

  useLayoutEffect(() => {
    requestNotes()
  }, [])

  const requestNotes = () => {
    getAllNotes().then((e: any) => {
      const result = e.target.result
      setNotes(result)
    })
  }

  const handleNoteDelete = (noteId: any): Promise<void> =>
    deleteNote(noteId).then(requestNotes)

  const handleNavigation = (event: Event, url: URL): void => {
    event.preventDefault()
    window.open(url, "_blank", "noreferrer")
  }

  const handleInputChange = (e: any): void => {
    const prevNotes = notes
    setInputValue(e.target.value)

    const debouncedRequestFilteredData = AwesomeDebouncePromise(
      getFilteredNotes,
      250
    )

    debouncedRequestFilteredData(e.target.value).then((notes: any) => {
      if (notes.length > 0) setNotes(notes)
      else setNotes(prevNotes)
    })
  }

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

          <Box padding="xxsmall" fullWidth>
            <TextField
              label="Filter by origin"
              value={inputValue}
              onChange={handleInputChange}
              s
            />
          </Box>

          <ul>
            {notes.length ? (
              notes.map((note: Note) => (
                <StyledListItem>
                  <Box
                    flex="row"
                    gap="xxsmall"
                    padding="xxsmall"
                    alignment="center"
                    justify="space-between"
                    fullWidth
                  >
                    <Box fullWidth padding="none">
                      <TextContent
                        tag="p"
                        size="small"
                        onClick={(e: Event) => handleNavigation(e, note.url)}
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
                      onClick={() => handleNoteDelete(note.id)}
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
