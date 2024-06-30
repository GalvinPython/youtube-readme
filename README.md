# YouTube Readme Updater
Updates your README file to show your latest video uploads on YouTube!

# Example Usage
> [!IMPORTANT]
> This action uses NodeJS 20

To use, simply create a file called `.github/workflows/main.yml` in your target repository. `main.yml` can be anything as long as it's a `.yml` file

```yml
name: Update README with latest YouTube videos

on:
  schedule:
    - cron: '0 * * * *'  # Runs every hour

jobs:
  update-readme:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout repository
      uses: actions/checkout@v2

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'

    - name: Update README
      uses: GalvinPython/youtube-readme@1.0
      with:
        youtube_channel_id: '' # Replace with your channel ID
        readme_file_path: 'README.md'
  
    - name: Configure Git
      run: |
        git config --global user.name 'github-actions[bot]'
        git config --global user.email 'github-actions[bot]@users.noreply.github.com'

    - name: Commit changes
      run: |
        git add README.md
        git commit -m "Update README with latest YouTube videos" || echo "No changes to commit"

    - name: Push changes
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      run: git push
```

# API
You can find the server for the API [here](https://github.com/GalvinPython/latest-uploads-api)

# Future Improvements
* Set a value between 1 and 5 videos
* Choose either shorts, streams or videos (or all)
* Format better
* Video statistics

# Changelog
## V1.0
* Released action