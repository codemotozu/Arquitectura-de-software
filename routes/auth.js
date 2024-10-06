// Esta línea define una ruta POST en el router de autenticación
authRouter.post("/update-settings", auth, async (req, res) => {
  try {
    // Extraemos los datos del cuerpo de la solicitud usando desestructuración
    const {
      pomodoroTimer,
      shortBreakTimer,
      longBreakTimer,
      longBreakInterval,
      selectedSound,
      browserNotificationsEnabled,
    } = req.body;

    // Definimos una lista de sonidos permitidos
    const allowedSounds = [
      "assets/sounds/Flashpoint.wav",
      "assets/sounds/Plink.wav",
      "assets/sounds/Blink.wav",
    ];

    // Verificamos si el sonido seleccionado está en la lista de permitidos
    if (!allowedSounds.includes(selectedSound)) {
      return res.status(400).json({ error: "Invalid sound selection" });
    }

    // Verificamos que todos los campos requeridos estén presentes
    if (
      pomodoroTimer === undefined ||
      shortBreakTimer === undefined ||
      longBreakTimer === undefined ||
      longBreakInterval === undefined ||
      selectedSound === undefined ||
      browserNotificationsEnabled === undefined
    ) {
      return res.status(400).json({
        error:
          "pomodoroTimer, shortBreakTimer, longBreakTimer and longBreakInterval are required",
      });
    }

    // Buscamos al usuario en la base de datos usando el ID proporcionado por el middleware de autenticación
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Actualizamos los campos del usuario con los nuevos valores
    user.pomodoroTimer = pomodoroTimer;
    user.shortBreakTimer = shortBreakTimer;
    user.longBreakTimer = longBreakTimer;
    user.longBreakInterval = longBreakInterval;
    user.selectedSound = selectedSound;
    user.browserNotificationsEnabled = browserNotificationsEnabled;

    // Guardamos los cambios en la base de datos
    await user.save();

    // Enviamos una respuesta exitosa con los datos actualizados
    res.json({
      message: "Settings updated successfully",
      pomodoroTimer: user.pomodoroTimer,
      shortBreakTimer: user.shortBreakTimer,
      longBreakTimer: user.longBreakTimer,
      longBreakInterval: user.longBreakInterval,
      selectedSound: user.selectedSound,
      browserNotificationsEnabled: user.browserNotificationsEnabled,
    });
  } catch (e) {
    // Si ocurre algún error durante el proceso, enviamos una respuesta de error
    res.status(500).json({ error: e.message });
  }
});
