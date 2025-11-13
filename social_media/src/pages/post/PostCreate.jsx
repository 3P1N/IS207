<!DOCTYPE html>
<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>ConnectSphere - Create Post</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet"/>
<script>
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "primary": "#2077e9",
            "background-light": "#f6f7f8",
            "background-dark": "#111821",
          },
          fontFamily: {
            "display": ["Plus Jakarta Sans", "Noto Sans", "sans-serif"]
          },
          borderRadius: {
            "DEFAULT": "0.25rem",
            "lg": "0.5rem",
            "xl": "0.75rem",
            "full": "9999px"
          },
        },
      },
    }
  </script>
<style>
    .material-symbols-outlined {
      font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24
    }
  </style>
</head>
<body class="bg-background-light dark:bg-background-dark font-display text-[#1C1E21] dark:text-white">
<div class="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
<main class="flex-grow w-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
<div class="w-full max-w-lg">
<div class="bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4">
<div class="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
<h2 class="text-xl font-bold text-[#1C1E21] dark:text-white">Create Post</h2>
<button class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-[#65676B] dark:text-gray-400">
<span class="material-symbols-outlined">close</span>
</button>
</div>
<div class="flex items-start gap-4 pt-4">
<div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0" data-alt="User avatar" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuA0ZZ_as3C9WDHTLF7lkX0AFwM12P7yjtCFjDygFT_780bEAJfDN2TRPO1J_PNENKBPWv4rMMH1UEZCvwEM6sga-w8sz2vjmlv23tagyYScuGLfadO3vsB7X9M6HHxHKw_6vS4h8SC12WvHDyhq6lUIzTKXmUI44JUUtoaPBJFmNXHgR9lAZ8kUf9Z_HOxJ3BPWaij0pr-xEADXPRWRYw_aaa2Tvk2vYsfbemkwDWsMHaYcpJ9KJs4ZlM0qcIFZQ4gvhVwRlOVi5Ko");'></div>
<div class="flex-grow">
<p class="font-bold text-[#1C1E21] dark:text-white">Alex Miller</p>
<button class="flex items-center gap-1 text-sm text-[#65676B] dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-md">
<span class="material-symbols-outlined text-base">public</span>
<span>Public</span>
<span class="material-symbols-outlined text-base">arrow_drop_down</span>
</button>
</div>
</div>
<div class="mt-4">
<textarea class="form-input w-full min-h-[120px] resize-none border-none focus:ring-0 text-xl placeholder:text-[#65676B] dark:placeholder:text-gray-400 bg-transparent p-0" placeholder="What's on your mind, Alex?"></textarea>
</div>
<div class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg mt-4">
<span class="text-sm font-medium text-[#1C1E21] dark:text-gray-300">Add to your post</span>
<div class="flex items-center gap-2">
<button class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-green-500" title="Add Photo/Video">
<span class="material-symbols-outlined">photo_library</span>
</button>
<button class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-primary" title="Tag Friends">
<span class="material-symbols-outlined">person_add</span>
</button>
<button class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-yellow-500" title="Feeling/Activity">
<span class="material-symbols-outlined">mood</span>
</button>
<button class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500" title="Check In">
<span class="material-symbols-outlined">location_on</span>
</button>
</div>
</div>
<div class="mt-4 grid grid-cols-2 gap-2">
<div class="relative group">
<div class="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg" data-alt="Preview of a mountain landscape" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuA_ut4WG_G44o8NrzInZKsft3j8s6kAnu0vv8X4aKG6t4jD5ojU3zH8vyb0Vb4VFLUUl1ikSqVs-1oWZjVnNftquSWRAY4WfhQi9pmbmx1NV0w4irDyCBNXcTiJAllIC_r1IIhCSPn2qDrP9lgakMkx5LLHD3XU6bwE3DY-eppJLx3_WTgARfyJ2hSjdHOoxsXb1UBygyfZrQkm2wXOFIk0xXBVhwMAZCmSUFtDYBrHQOoNvHuuUvAEg_pbOWFloONQqi3s8RWal-o");'></div>
<button class="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
<span class="material-symbols-outlined text-base">close</span>
</button>
</div>
<div class="relative group">
<div class="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg" data-alt="Preview of a tropical beach" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuD2G8aYtH64UHc8rkjTTb9X-m61UhsnEWLb3eNdtEaz4kgNB0mo9DyOuBaBjA0vaqoJ8bd4Kb8pxHHu1aPAjiULOnYo1GoapBcYEmZuJrfsn9i7zcEjoPelRDvmhKd6yy54bf2d0enBdCmqsf44EU4-ghmPxLofsICaCqf3HpVm67g2cVRwFbiLzZKSmUNpYfrfhD_C0J30r7GzGvMCLokQrNyS9vllQ8ccugAQyuaTzjh8E-1M37Rav7JXEASCmQ9KBfA_VZOUxpM");'></div>
<button class="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
<span class="material-symbols-outlined text-base">close</span>
</button>
</div>
</div>
<div class="mt-4 flex gap-2">
<button class="flex-1 w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold">
<span class="truncate">Post</span>
</button>
</div>
</div>
</div>
</main>
</div>

</body></html>