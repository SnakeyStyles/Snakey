let FormatURL = {
  Templates: [
    [/^(https?):\/\/gitlab\.com\/([^\/]+.*\/[^\/]+)\/(?:raw|blob)\/(.+?)(?:\?.*)?$/i, '$1://gl.githack.com/$2/raw/$3', i18n('gitlab')],
    [/^(https?):\/\/bitbucket\.org\/([^\/]+\/[^\/]+)\/(?:raw|src)\/(.+?)(?:\?.*)?$/i, '$1://bb.githack.com/$2/raw/$3', i18n('bitbucket')],
    [/^(https?):\/\/bitbucket\.org\/snippets\/([^\/]+\/[^\/]+)\/revisions\/([^\/\#\?]+)(?:\?[^#]*)?(?:\#file-(.+?))$/i, '$1://bb.githack.com/!api/2.0/snippets/$2/$3/files/$4', i18n('bitbucket')],
    [/^(https?):\/\/bitbucket\.org\/snippets\/([^\/]+\/[^\/\#\?]+)(?:\?[^#]*)?(?:\#file-(.+?))$/i, '$1://bb.githack.com/!api/2.0/snippets/$2/HEAD/files/$3', i18n('bitbucket')],
    [/^(https?):\/\/bitbucket\.org\/\!api\/2.0\/snippets\/([^\/]+\/[^\/]+\/[^\/]+)\/files\/(.+?)(?:\?.*)?$/i, '$1://bb.githack.com/!api/2.0/snippets/$2/files/$3', i18n('bitbucket')],
    [/^(https?):\/\/api\.bitbucket\.org\/2.0\/snippets\/([^\/]+\/[^\/]+\/[^\/]+)\/files\/(.+?)(?:\?.*)?$/i, '$1://bb.githack.com/!api/2.0/snippets/$2/files/$3', i18n('bitbucket')],
    [/^(https?):\/\/(?:cdn\.)?rawgit\.com\/(.+?\/[0-9a-f]+\/raw\/(?:[0-9a-f]+\/)?.+)$/i, '$1://gist.githack.com/$2', i18n('rawgitGist')],
    [/^(https?):\/\/(?:cdn\.)?rawgit\.com\/([^\/]+\/[^\/]+\/[^\/]+|[0-9A-Za-z-]+\/[0-9a-f]+\/raw)\/(.+)/i, '$1://raw.githack.com/$2/$3', i18n('rawgit')],
    [/^(https?):\/\/gitcdn\.(?:xyz|link)\/[^\/]+\/(.+?\/[0-9a-f]+\/raw\/(?:[0-9a-f]+\/)?.+)$/i, '$1://gist.githack.com/$2', i18n('githubGist')],
    [/^(https?):\/\/gitcdn\.(?:xyz|link)\/[^\/]+\/([^\/]+\/[^\/]+\/[^\/]+|[0-9A-Za-z-]+\/[0-9a-f]+\/raw)\/(.+)/i, '$1://raw.githack.com/$2/$3', i18n('githubGist')],
    [/^(https?):\/\/raw\.github(?:usercontent)?\.com\/([^\/]+\/[^\/]+\/[^\/]+|[0-9A-Za-z-]+\/[0-9a-f]+\/raw)\/(.+)/i, '$1://raw.githack.com/$2/$3', i18n('github')],
    [/^(https?):\/\/github\.com\/(.[^\/]+?)\/(.[^\/]+?)\/(?!releases\/)(?:(?:blob|raw)\/)?(.+?\/.+)/i, '$1://raw.githack.com/$2/$3/$4', i18n('github')],
    [/^(https?):\/\/gist\.github(?:usercontent)?\.com\/(.+?\/[0-9a-f]+\/raw\/(?:[0-9a-f]+\/)?.+)$/i, '$1://gist.githack.com/$2', i18n('githubGist')],
    [/^(https?):\/\/pastebin\.com\/([0-9a-zA-Z]{8})\/?$/i, '$1://pastebin.com/raw/$2', i18n('pastebin')],
    [/^(https?):\/\/ghostbin\.com\/paste\/([0-9a-z]{5})\/?$/i, '$1://ghostbin.com/paste/$2/raw', i18n('ghostbin')],
    [/^(https?):\/\/oneclickpaste\.com\/([0-9]+)\/?$/i, '$1://oneclickpaste.com/paste.php?download&id=$2/', i18n('oneclickpaste')],
    [/^(https?):\/\/drive\.google\.com\/(file\/d\/|open\/\?id=)([\w-]+)(\/view)?\/?$/i, '$1://drive.google.com/uc?id=$3&export=download', i18n('googleDrive')],
    [/^(https?):\/\/(www\.)?dropbox\.com\/s\/([a-z0-9]+)\/([\w-%\.\s]+)(\?.+)?$/i, '$1://www.dropbox.com/s/$3/$4?dl=1', i18n('dropbox')]
  ],
  match(url) {
    url = decodeURIComponent(url.trim());

    for (var i in FormatURL.Templates) {
      var pattern = FormatURL.Templates[i][0],
          template = FormatURL.Templates[i][1],
          service = FormatURL.Templates[i][2];

      if (pattern.test(url))
        return { url: url.replace(pattern, template), service };
    }

    return { url, service: null }
  }
}