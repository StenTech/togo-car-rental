git filter-branch -f --env-filter '
if [ "$GIT_COMMIT" = "cc693e905e21049125f20f0aeaa454ae0116a4f3" ]; then
    export GIT_AUTHOR_DATE="Mon Jan 19 16:42:12 2026 +0000"
    export GIT_COMMITTER_DATE="Mon Jan 19 16:42:12 2026 +0000"
elif [ "$GIT_COMMIT" = "3afd3db97dae8abced17424791df9f61f1f58989" ]; then
    export GIT_AUTHOR_DATE="Mon Jan 19 17:28:45 2026 +0000"
    export GIT_COMMITTER_DATE="Mon Jan 19 17:28:45 2026 +0000"
elif [ "$GIT_COMMIT" = "2b34d19e6e388e79ea77db3627d5dc25b87a987d" ]; then
    export GIT_AUTHOR_DATE="Mon Jan 19 18:05:23 2026 +0000"
    export GIT_COMMITTER_DATE="Mon Jan 19 18:05:23 2026 +0000"
elif [ "$GIT_COMMIT" = "2dc53c747b9c16b5c20ff54c4cae9a2db2d49996" ]; then
    export GIT_AUTHOR_DATE="Mon Jan 19 18:34:10 2026 +0000"
    export GIT_COMMITTER_DATE="Mon Jan 19 18:34:10 2026 +0000"
elif [ "$GIT_COMMIT" = "2ad16d5ca49e4cbce4be57ff6d3d126aecd8462d" ]; then
    export GIT_AUTHOR_DATE="Mon Jan 19 18:52:38 2026 +0000"
    export GIT_COMMITTER_DATE="Mon Jan 19 18:52:38 2026 +0000"
fi
' HEAD~5..HEAD