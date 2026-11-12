/**
 * Centralized Wedding Configuration for Valeria & Ramiro.
 * All code identifiers are in English; all UI copy is in Spanish.
 * Modify this file directly via the Antigravity agent to update venues, times, photos, or music.
 */
export const weddingData = {
  couple: {
    brideFullName: 'Valeria Albus Sánchez',
    groomFullName: 'Ramiro Ballestas Molina',
    monogram: 'V & R',
    hostsLine: 'JHON ALBUS & ELIZABETH SÁNCHEZ',
    invitationIntro: 'Tienen el placer de invitarlos al matrimonio de',
    inMemoriamText:
      'En memoria de Rubby Molina & Ramiro Ballestas Uribe, quienes viven siempre presentes en nuestros corazones.',
    biblicalQuote:
      '“Sus llamas son un fuego ardiente, la llama de Jah. Las aguas embravecidas no pueden extinguir el amor, ni pueden los ríos llevárselo con la corriente”',
    biblicalReference: '(Cant. 8:6, 7)'
  },
  eventDate: {
    isoTargetDate: '2026-12-11T17:00:00-05:00',
    fullDateLabel: 'VIERNES, 11 DE DICIEMBRE DE 2026',
    monthShort: 'DIC',
    dayName: 'VIERNES',
    dayNumber: '11',
    timeLabel: 'A LAS 5:00 P.M.',
    yearNumber: '2026',
    cityLocation: 'Santa Marta, Colombia',
    rsvpDeadlineLabel: '20 de Noviembre de 2026'
  },
  assets: {
    floralBackgroundUrl: '/assets/bg-floral-original.png',
    leafAccentUrl: '/assets/bg-leaf-accent.png',
    waxSealUrl: '/assets/wax-seal-real.png',
    ceremonyPhotoUrl: '/assets/venue-ceremony.png',
    restaurantPhotoUrl: '/assets/venue-restaurant.png',
    backgroundSongUrl: '/assets/wedding-song.mp3'
  },
  venues: {
    sectionTitle: 'Ubicaciones en Santa Marta',
    sectionSubtitle: 'Todo lo que necesitas saber para acompañarnos',
    ceremony: {
      title: 'Consejos Bíblicos',
      placePretext: 'TENDRÁN LUGAR EN',
      venueName: 'Salón del Reino de Los Testigos de Jehová',
      addressLine: 'Cl. 21 No. 3 A-34 Rodadero Sur',
      timeLabel: '5:00 P.M.',
      mapsUrl:
        'https://www.google.com/maps/search/?api=1&query=Sal%C3%B3n+del+Reino+de+Los+Testigos+de+Jehov%C3%A1+Cl+21+No+3+A-34+Rodadero+Sur+Santa+Marta'
    },
    reception: {
      title: 'Recepción',
      placePretext: 'CELEBRAREMOS JUNTOS EN',
      venueName: 'Punta Brava',
      addressLine: 'Cra. 4 No. 6-01 Rodadero',
      timeLabel: '7:00 P.M.',
      mapsUrl:
        'https://www.google.com/maps/search/?api=1&query=Punta+Brava+Techo+Verde+Cra+4+No+6-01+Rodadero+Santa+Marta'
    }
  },
  schedule: {
    sectionTitle: 'Cronograma del Día',
    items: [
      { id: 'ceremony', time: '05:00 PM', title: 'Consejos Bíblicos', iconName: 'Heart' },
      {
        id: 'reception',
        time: '07:00 PM',
        title: 'Recepción en Punta Brava',
        iconName: 'Utensils'
      }
    ]
  },
  dressCode: {
    sectionTitle: 'Código de Vestimenta',
    subtitle: 'Una velada elegante junto al mar Caribe',
    styleTitle: 'Estilo Formal',
    ladiesLabel: 'Damas: Vestido Largo',
    gentlemenLabel: 'Caballeros: Traje y Corbata'
  },
  rsvp: {
    whatsappPhoneDisplay: '313 673 0779',
    whatsappUrl: 'https://wa.me/573136730779',
    googleAppsScriptWebhookUrl:
      'https://script.google.com/macros/s/AKfycbyHDWyain6FqF2kV9lbXXhkw_8FSqAAGTb_MbJlya4ZfC-mQRcEayimYHJUeH_rRLxP/exec'
  },
  zoomConfig: {
    title: 'Consejos Bíblicos Matrimoniales',
    meetingUrl: 'https://jworg.zoom.us/j/89805963404',
    meetingId: '898 0596 3404',
    passcode: '111226',
    hostLabel: 'Cong. Edén',
    timeScheduleLabel: '4:30 PM - 6:15 PM',
    ceremonyStartTime: '5:00 P.M.',
    venueName: 'Salón del Reino de Los Testigos de Jehová',
    city: 'Santa Marta, Colombia',
    heroNotice:
      'Consejos bíblicos que se realizarán en el Salón del Reino de Los Testigos de Jehová, a las 5:00 P.M. (Conexión Zoom desde las 4:30 P.M.)',
    cardTitle: 'Transmisión en Vivo vía Zoom',
    joinButtonLabel: 'Unirse a la Reunión',
    copyButtonLabel: 'Copiar ID y Clave',
    scheduleItems: [
      { id: 'zoom-open', time: '04:30 PM', title: 'Conexión Zoom', iconName: 'Video' },
      {
        id: 'ceremony-virtual',
        time: '05:00 PM',
        title: 'Consejos Bíblicos Matrimoniales',
        iconName: 'Heart'
      }
    ]
  },
  ceremonyOnlyConfig: {
    rsvpDeadlineLabel: '16 de Noviembre de 2026',
    sectionTitle: 'Consejos Bíblicos',
    sectionSubtitle: 'Todo lo que necesitas saber para acompañarnos',
    scheduleItems: [
      { id: 'ceremony', time: '05:00 PM', title: 'Consejos Bíblicos', iconName: 'Heart' }
    ]
  }
};
