import { isNil, trim } from 'es-toolkit'
import { DateTime } from 'luxon'
import type { CSSProperties } from 'react'
import sparkMd5 from 'spark-md5'
import { metadata } from '#@/constants/metadata.ts'
import type { ResolvedPreference } from '#@/constants/preference.ts'
import { defaultLanguage } from './i18n.ts'

export function restoreTitleForSorting(title: string) {
  const match = /^(?<mainTitle>.*),\s*(?<article>A|An|The)(?<additionalInfo>\s*(?:\S.*)?)$/u.exec(title)
  if (match?.groups) {
    const { additionalInfo, article, mainTitle } = match.groups
    return `${article} ${mainTitle}${additionalInfo}`
  }
  return title
}

export function humanizeDate(date: string, dateFormat: string) {
  const dateTime = DateTime.fromJSDate(new Date(date))
  const now = DateTime.now()
  if (dateTime.hasSame(now, 'year')) {
    const shortFormat = trim(dateFormat.replace('yyyy', ''), ['-', '/', '.'])
    return dateTime.toFormat(`${shortFormat} HH:mm`)
  }
  return dateTime.toFormat(`${dateFormat} HH:mm`)
}

export function encodeRFC3986URIComponent(str: string) {
  return encodeURIComponent(str).replaceAll(/[!'()*]/gu, (c) => `%${c.codePointAt(0)?.toString(16).toUpperCase()}`)
}

export async function getFileMd5(file: Blob) {
  const buffer = await file.arrayBuffer()
  return sparkMd5.ArrayBuffer.hash(buffer)
}

export function getHomePath(language: string) {
  return `/${language === defaultLanguage ? '' : language.toLowerCase()}`
}

export function getGlobalCSSVars(preference?: ResolvedPreference) {
  const uiPreference = preference?.ui
  return {
    '--brand': metadata.themeColor,
    '--game-saturate': uiPreference?.saturationApplyToGame === true ? `${uiPreference.saturation}%` : '100%',
    '--img-saturate': uiPreference?.saturationApplyToImages === true ? `${uiPreference.saturation}%` : '100%',
    '--saturate': isNil(uiPreference?.saturation) ? '100%' : `${uiPreference.saturation}%`,
  } as CSSProperties
}
