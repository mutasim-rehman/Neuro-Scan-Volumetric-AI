/**
 * Volumetric data loader
 * Parses custom binary protocol with 40-byte header
 */

/**
 * Load volumetric data from API endpoint
 * 
 * Binary Format:
 * - Header (40 bytes): width, height, depth (uint32 each), data_type (uint32), reserved (28 bytes)
 * - Data: float32 array
 * 
 * @param {string} fileId - Identifier for the volumetric file
 * @returns {Promise<{data: Float32Array, width: number, height: number, depth: number}>}
 */
export async function loadVolumetricData(fileId) {
  const response = await fetch(`/api/volumetric/${fileId}`)
  
  if (!response.ok) {
    throw new Error(`Failed to load volumetric data: ${response.statusText}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const view = new DataView(arrayBuffer)

  // Parse 40-byte header
  const width = view.getUint32(0, false)  // Big-endian
  const height = view.getUint32(4, false)
  const depth = view.getUint32(8, false)
  const dataType = view.getUint32(12, false)

  if (dataType !== 1) {
    throw new Error(`Unsupported data type: ${dataType}. Expected 1 (float32)`)
  }

  // Extract float32 data (starts at byte 40)
  const dataStart = 40
  const dataLength = width * height * depth
  const float32Array = new Float32Array(
    arrayBuffer.slice(dataStart, dataStart + dataLength * 4)
  )

  return {
    data: float32Array,
    width,
    height,
    depth,
  }
}

