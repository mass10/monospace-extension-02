/// 外部コマンドを実行します。
fn spawn(args: &[&str]) -> Result<(), Box<dyn std::error::Error>> {
	let (command, args) = args.split_first().unwrap();

	let mut cmd = std::process::Command::new(command);
	cmd.args(args);

	let status = cmd.status()?;
	if !status.success() {
		eprintln!("Command failed with exit code: {}", status);
		return Err("Command failed".into());
	}

	return Ok(());
}

/// 現在のディレクトリを変更します。
fn chdir(path: &str) -> Result<(), Box<dyn std::error::Error>> {
	std::env::set_current_dir(path)?;
	return Ok(());
}

/// OS を判定します。(Windows)
fn is_windows() -> bool {
	std::env::consts::OS == "windows"
}

/// OS を判定します。(Linux)
fn is_linux() -> bool {
	std::env::consts::OS == "linux"
}

/// 環境変数 PATH に指定されたパスを追加します。
/// 指定されたパスを環境変数 PATH に追加します。
fn add_to_path(arg: &str) -> Result<(), Box<dyn std::error::Error>> {
	if is_windows() {
		let path = std::env::var("PATH")?;

		// ";" で分割して、ベクタにします。空の要素を除外します。
		let mut paths = path.split(';').filter(|s| !s.is_empty()).collect::<Vec<_>>();

		// 要求されたパスを先頭に挿入
		paths.insert(0, arg);

		// 書き換え
		let path = paths.join(";");
		std::env::set_var("PATH", &path);
	} else if is_linux() {
		let path = std::env::var("PATH")?;

		// ";" で分割して、ベクタにします。空の要素を除外します。
		let mut paths = path.split(':').filter(|s| !s.is_empty()).collect::<Vec<_>>();

		// 要求されたパスを先頭に挿入
		paths.insert(0, arg);

		// 書き換え
		let path = paths.join(";");
		std::env::set_var("PATH", &path);
	} else {
		// NOP
	}

	return Ok(());
}

/// Chrome 拡張機能をビルドします。
#[allow(unused)]
fn build_chrome_extension() -> Result<(), Box<dyn std::error::Error>> {
	chdir("../")?;

	// add_to_path("C:\\node-v14.21.3-win-x64")?;
	// add_to_path("C:\\node-v16.20.2-win-x64")?;
	add_to_path("C:\\node-v18.18.2-win-x64")?;

	spawn(&["npm.cmd", "install", "yarn", "-g"])?;
	spawn(&["yarn.cmd", "--version"])?;
	spawn(&["yarn.cmd", "install"])?;
	spawn(&["yarn.cmd", "build"])?;
	spawn(&["cmd.exe", "/C", "START ", "dist"])?;

	return Ok(());
}

#[allow(unused)]
fn serve_local_application() -> Result<(), Box<dyn std::error::Error>> {
	chdir("../")?;

	// add_to_path("C:\\node-v14.21.3-win-x64")?;
	// add_to_path("C:\\node-v16.20.2-win-x64")?;
	add_to_path("C:\\node-v18.18.2-win-x64")?;

	spawn(&["npm.cmd", "install", "yarn", "-g"])?;
	spawn(&["yarn.cmd", "--version"])?;
	spawn(&["yarn.cmd", "install"])?;
	spawn(&["yarn.cmd", "dev"])?;

	return Ok(());
}

/// Rust アプリケーションのエントリーポイント
fn main() {
	let args: Vec<String> = std::env::args().skip(1).collect();

	let command = match args.len() {
		0 => "build",
		_ => &args[0],
	};

	if command == "build" {
		if let Err(err) = build_chrome_extension() {
			eprintln!("[ERROR] {}", err);
			std::process::exit(1);
		}
	} else if command == "serve" {
		// ※動作未確認
		if let Err(err) = serve_local_application() {
			eprintln!("[ERROR] {}", err);
			std::process::exit(1);
		}
	} else {
		if let Err(err) = build_chrome_extension() {
			eprintln!("[ERROR] {}", err);
			std::process::exit(1);
		}
	}
}
