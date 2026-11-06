// Fill catalog forms from artwork file names. The naming rule lives in
// superb_app docs/pet-nest-art/README.md and tools/build_upload_folder.py:
//   items:  中文名稱_English Name_id.webp   e.g. 奶油圓地毯_Cream Round Rug_rug_round_cream.webp
//   pets:   a folder 中文名稱_English Name_id/ holding 01_坐著.gif … 06_頭像.gif
// The Chinese and English parts are optional; the id is everything after them.

const ID_PATTERN = /^[a-z0-9_]{2,40}$/
const HAS_CJK = /[^\x00-\x7F]/

/** { tw, en, id } from a file or folder name; missing parts are ''. */
export function parseUploadName(name) {
  const parts = name.normalize('NFC').replace(/\.(webp|gif)$/i, '').trim().split('_')
  let tw = ''
  let en = ''
  if (parts.length > 1 && HAS_CJK.test(parts[0])) tw = parts.shift().trim()
  // English names start with a capital or contain spaces; ids never do.
  if (parts.length > 1 && !/^[a-z0-9]+$/.test(parts[0])) en = parts.shift().trim()
  const id = parts.join('_').trim().toLowerCase()
  return { tw, en, id: ID_PATTERN.test(id) ? id : '' }
}

const POSE_WORDS = [
  ['sit', ['坐', 'sit']],
  ['happy', ['開心', 'happy']],
  ['eat', ['吃', 'eat']],
  ['sleep', ['睡', 'sleep']],
  ['weak', ['虛弱', 'weak']],
  ['avatar', ['頭像', 'avatar']],
]

/** sit / happy / eat / sleep / weak / avatar from a pose file name, or ''. */
export function poseOf(name) {
  const text = name.normalize('NFC').toLowerCase()
  return POSE_WORDS.find(([, words]) => words.some(word => text.includes(word)))?.[0] || ''
}

const KIND_PREFIXES = [
  ['bg_', 'background'], ['rug_', 'rug'], ['toy_', 'toy'], ['poster_', 'wall'], ['wall_', 'wall'],
  ['shelf_', 'left_tall'], ['tower_', 'left_tall'],
]
const ITEM_KINDS = ['background', 'left_tall', 'wall', 'rug', 'toy', 'right_large']

/** Slot kind from the image's recommended size, then the id prefix, else ''. */
export function guessSlotKind(id, size, assetSizes) {
  const bySize = ITEM_KINDS.find(kind => assetSizes?.[kind]?.[0] === size?.[0] && assetSizes?.[kind]?.[1] === size?.[1])
  if (bySize) return bySize
  return KIND_PREFIXES.find(([prefix]) => id.startsWith(prefix))?.[1] || ''
}

export async function imageSize(file) {
  try {
    const bitmap = await createImageBitmap(file)
    const size = [bitmap.width, bitmap.height]
    bitmap.close()
    return size
  } catch { return null }
}

/** The pet folder's name: from a folder pick, or '' for loose files. */
export const folderOf = files => (files[0]?.webkitRelativePath || '').split('/').slice(-2, -1)[0] || ''
