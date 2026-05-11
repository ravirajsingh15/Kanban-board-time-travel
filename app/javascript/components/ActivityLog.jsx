export default function ActivityLog({
  events = [],
}) {

  return (
    <div
      style={{
        width: "300px",
        background: "white",
        padding: "20px",
        borderLeft:
          "1px solid #ddd",
      }}
    >

      <h2
        style={{
          marginBottom:
            "20px",
        }}
      >
        Activity Log
      </h2>

      {events.map((event) => (

        <div
          key={event.id}

          style={{
            marginBottom:
              "12px",

            paddingBottom:
              "12px",

            borderBottom:
              "1px solid #eee",
          }}
        >

          {/* CREATED */}

          {event.event_type ===
            "created" && (

            <p>
              Card "
              {
                event.data
                  ?.title
              }"
              created
            </p>

          )}

          {/* DELETED */}

          {event.event_type ===
            "deleted" && (

            <p>
              Card "
              {
                event.data
                  ?.title
              }"
              deleted
            </p>

          )}

          {/* UPDATED */}

          {event.event_type ===
            "updated" && (

            <p>
              Card "
              {
                event.data
                  ?.title
              }"
              updated
            </p>

          )}

          {/* MOVED */}

          {event.event_type ===
            "moved" && (

            <p>
              Card "
              {
                event.data
                  ?.title
              }"
              moved from
              {
                event.data
                  ?.from
              }
              to
              {
                event.data
                  ?.to
              }
            </p>

          )}

          {/* REORDERED */}

          {event.event_type ===
            "reordered" && (

            <p>
              Card "
              {
                event.data
                  ?.title
              }"
              reordered
            </p>

          )}

        </div>

      ))}

    </div>
  );
}