authRouter.post("/update-settings", auth, async (req, res) => {
  try {
    const {
      pomodoroTimer,
      shortBreakTimer,
      longBreakTimer,
      longBreakInterval,
      selectedSound,
      browserNotificationsEnabled,
    } = req.body;

    const allowedSounds = [
      "assets/sounds/Flashpoint.wav",
      "assets/sounds/Plink.wav",
      "assets/sounds/Blink.wav",
    ];

    if (!allowedSounds.includes(selectedSound)) {
      return res.status(400).json({ error: "Invalid sound selection" });
    }

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

    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.pomodoroTimer = pomodoroTimer;
    user.shortBreakTimer = shortBreakTimer;
    user.longBreakTimer = longBreakTimer;
    user.longBreakInterval = longBreakInterval;
    user.selectedSound = selectedSound;
    user.browserNotificationsEnabled = browserNotificationsEnabled;

    await user.save();

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
    res.status(500).json({ error: e.message });
  }
});
