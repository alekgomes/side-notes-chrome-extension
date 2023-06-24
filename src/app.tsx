import { useLayoutEffect, useState } from "preact/hooks"
import { styled } from "styled-components"
import { Note } from "./types"
import { DB_NAME, DB_VERSION, STORE_NOTES } from "./config"
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

  useLayoutEffect(() => {
    requestNotes()
  }, [])

  const requestNotes = async () => {
    let db: any

    const dbConnection = indexedDB.open(DB_NAME, DB_VERSION)
    dbConnection.onsuccess = (event: any) => {
      db = event.target?.result
      const transaction = db.transaction([STORE_NOTES], "readonly")
      const store = transaction.objectStore(STORE_NOTES)
      const getAllRequest = store.getAll()

      getAllRequest.onsuccess = (e: any) => {
        setNotes(e.target.result)
        db.close()
      }
    }
  }

  const requestDelete = async (noteId: any) => {
    let db: any

    const dbConnection = indexedDB.open(DB_NAME, DB_VERSION)

    dbConnection.onsuccess = (event: any) => {
      db = event.target?.result
      const transaction = db.transaction([STORE_NOTES], "readwrite")
      const store = transaction.objectStore(STORE_NOTES)
      const deleteRequest = store.delete(noteId)

      deleteRequest.onsuccess = (e: any) => {
        setNotes(notes.filter((note: Note) => note.id !== noteId))
        db.close()
      }

      deleteRequest.onerror = () => {
        db.close()
      }
    }
  }

  const handleNavigation = (event: Event, url: URL) => {
    event.preventDefault()
    window.open(url, "_blank", "noreferrer")
  }

  return (
    <SaguProvider theme={theme}>
      <SaguGlobalStyles />
      <StyledMain>
        <Box flex="column" gap="large" border shadow padding="medium" fullWidth>
          <Ribbon>Beta</Ribbon>
          <Heading lineLeft lineColor="secondary" size="huge">
            Side Notes
          </Heading>
          <Divider />
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
                      onClick={() => requestDelete(note.id)}
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
