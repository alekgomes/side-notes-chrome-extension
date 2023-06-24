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
  NavLink,
  TextContent,
  Ribbon,
} from "sagu-ui"

Object.assign(theme.colors, wine)

const StyledMain = styled.main`
  width: 520px;
`

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
        setNotes(e)
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
        <Box flex="column" gap="large" border shadow padding="medium">
          <Ribbon>Beta</Ribbon>
          <Heading lineLeft lineColor="secondary" size="huge">
            Side Notes
          </Heading>
          <Divider />
          <Box
            shadow={false}
            flex="row"
            gap="xsmall"
            fullWidth={true}
            justify="end"
          >
            <Button
              size="xsmall"
              outline={false}
              padding="none"
              onClick={() => setNotes([])}
            >
              Delete all
            </Button>
            <Button
              size="xsmall"
              outline={false}
              padding="none"
              onClick={() => setNotes(notes)}
            >
              Restore
            </Button>
          </Box>
          <ul>
            {notes.length ? (
              notes.map((note: Note) => (
                <li>
                  <Box
                    flex="row"
                    gap="xxsmall"
                    padding="xxsmall"
                    alignment="center"
                    justify="space-between"
                    fullWidth
                  >
                    <NavLink
                      size="small"
                      onClick={(e: Event) => handleNavigation(e, note.url)}
                      padding="none"
                    >
                      {note.content}
                    </NavLink>
                    <Button
                      variant="filled"
                      padding="mini"
                      size="xsmall"
                      onClick={() => requestDelete(note.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </li>
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
