const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("O servidor está sendo executado corretamente");
});

io.on("Conecxao", (socket) => {
  socket.emit("me", socket.id);
  console.log("Forneça uma chave");

  socket.on("disconectado", () => {
    socket.broadcast.emit("Fim da Chamada");
  });

  socket.on("Chamada de Usuario", ({ userToCall, signalData, from, name }) => {
    console.log("Chave de Chamada de Usuario");
    io.to(userToCall).emit("Chamada de Usuario", { signal: signalData, from, name });
    console.log("Chamada de Usuario concluida");
  });

  socket.on("Chamada de Atendimento", (data) => {
    io.to(data.to).emit("chamada aceita", { signal: data.signal });
    console.log("Chamada de Atendimento Concluida");
  });
});

server.listen(PORT, () => {
  console.log(`O servidor está execuntando na porta ${PORT}`);
});
