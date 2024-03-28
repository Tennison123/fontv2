import { Component, OnInit , OnDestroy } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PostPostReq } from '../../model/Posts.post.req.js';
import { CommonModule } from '@angular/common';
import axios from 'axios';
import { conn } from "../../../api/dbconnect";
import { ActivatedRoute } from '@angular/router';
import {MatChipsModule} from '@angular/material/chips';
import Swal from 'sweetalert2'
import { Subscription, interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import cors from "cors";
@Component({
  selector: 'app-vote',
  standalone: true,
  imports: [MatToolbarModule,MatButtonModule,HttpClientModule,CommonModule],
  templateUrl: './vote.component.html',
  styleUrl: './vote.component.scss'
})
export class VoteComponent implements OnInit, OnDestroy {
  show: PostPostReq[] = [];
  K: number = 32;
  PictureID: number[] = [];
  currentDate: string = ''; // กำหนดค่าเริ่มต้นเป็น string
  private destroy$: Subject<void> = new Subject(); // เพื่อยกเลิกการทำงานของ interval อย่างถูกต้อง

  constructor(private router: Router, private route: ActivatedRoute, private httpClient: HttpClient) {}

  async ngOnInit() {
    const HOST: string = 'http://localhost:4000';
    const url = `${HOST}/facemash/vote`;
    this.getCurrentDateTime(); // เรียกใช้งาน getCurrentDateTime() ใน ngOnInit()
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getCurrentDateTime(); // เรียกใช้งาน getCurrentDateTime() ทุกๆ 1 วินาที
      });
  
    try {
      const response = await axios.get(url);
  
      if (Array.isArray(response.data)) {
        this.show = response.data;

        this.PictureID = [this.show[0].post_id, this.show[1].post_id];
      } else {
        console.error('Invalid data format. Expected an array.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async ngOnDestroy() {
    // ยกเลิกการทำงานของ interval เมื่อ component ถูกทำลาย
    this.destroy$.next();
    this.destroy$.complete();
  }

  async vote(winnerPostId: number, loserPostId: number) {
    const URL = 'http://localhost:4000/facemash/vote';
    
    try {
        const response = await axios.post(URL, { winnerPostId, loserPostId });
        console.log('Response data:', response.data);

        const { updatedWinner, updatedEloRatingWinner, updatedLoser, updatedEloRatingLoser } = response.data;

        if (updatedWinner && updatedLoser) {
            this.updatePostScore(this.show, updatedWinner, updatedEloRatingWinner.newRating);
            this.updatePostScore(this.show, updatedLoser, updatedEloRatingLoser.newRating);
           
            // คำนวณคะแนน Elo Rating ของผู้ชนะ
            const winnerOldRating = updatedEloRatingWinner.oldRating;
            const winnerNewRating = updatedEloRatingWinner.newRating;
            const winnerDelta = winnerNewRating - winnerOldRating;
            const winnerMessage = `ผู้ชนะ Post ID: ${updatedWinner.post_id}, คะแนนเก่า: ${winnerOldRating}, คะแนนใหม่: ${winnerNewRating}, คะแนนที่ได้: ${winnerDelta}`;
            const loserOldRating = updatedEloRatingLoser.oldRating;
            const loserNewRating = updatedEloRatingLoser.newRating;
            const loserDelta = loserNewRating - loserOldRating;
            const loserMessage = `ผู้แพ้ Post ID: ${updatedLoser.post_id}, คะแนนเก่า: ${loserOldRating}, คะแนนใหม่: ${loserNewRating}, คะแนนที่ได้: ${loserDelta}`;
            // แสดงข้อความเมื่อมีการเสียงโหวตเสร็จสมบูรณ์
            const winnerCalculation = `วิธีการคำนวณคะแนนผู้ชนะ: นำคะแนนเก่าของผู้ชนะ (${winnerOldRating}) บวกกับ ${this.K} คูณ (1 - ความน่าจะเป็นที่ผู้ชนะ)`;
            const loserCalculation = `วิธีการคำนวณคะแนนผู้แพ้: นำคะแนนเก่าของผู้แพ้ (${loserOldRating}) บวกกับ ${this.K} คูณ (0 - ความน่าจะเป็นที่ผู้ชนะ)`;
            const finalMessage = `${winnerMessage}<br>${winnerCalculation}<br><br>${loserMessage}<br>${loserCalculation}`;
            let updatedScore = winnerDelta; // คะแนนที่คำนวณได้
            let updatedScoreText = `(${updatedScore > 0 ? '+' : ''}${updatedScore})`;
            let calculationMessage = `วิธีการคำนวณคะแนนผู้ชนะ: นำคะแนนเก่าของผู้ชนะ (${updatedEloRatingWinner.oldRating}) `;
            calculationMessage += `เพิ่มหรือลดด้วยคะแนนที่คำนวณได้ ${updatedScoreText}`;

            Swal.fire({
                title: 'โหวตสำเร็จ!',
                html: finalMessage,
                icon: 'success'
            });
        } else {
            // แสดงข้อความเมื่อมีข้อผิดพลาด
            Swal.fire({
                title: 'เกิดข้อผิดพลาด!',
                text: 'ไม่สามารถบันทึกโหวตได้',
                icon: 'error'
            });
        }
    } catch (error) {
        console.error('Error processing vote:', error);
        // แสดงข้อความเมื่อมีข้อผิดพลาด
        Swal.fire({
            title: 'เกิดข้อผิดพลาด!',
            text: 'ไม่สามารถบันทึกโหวตได้',
            icon: 'error'
        });
    }
}




  updatePostScore(postArray: any[], updatedPost: { post_id: any; }, newRating: any) {
    const postIndex = postArray.findIndex(post => post.post_id === updatedPost.post_id);
  
    if (postIndex !== -1) {
        const oldScore = postArray[postIndex].score;
        postArray[postIndex].score = newRating;
  
        console.log(`Post ID: ${updatedPost.post_id}, Old Score: ${oldScore}, New Score: ${newRating}`)
        
        // แสดง Swal.fire เฉพาะ Post ID ที่ชนะ
        if (newRating > oldScore) {
            Swal.fire({
              title: `You Vote Post ID: ${updatedPost.post_id}`,
              text: `Old Score: ${oldScore}, New Score: ${newRating}`,
              icon: "success"
            }).then(() => {
              // รีโหลดหน้าเว็บเมื่อกด OK
              // window.location.reload();
            });
        }
    }
  }

  getCurrentDateTime() {
    const currentDate = new Date();
    this.currentDate = currentDate.toLocaleString();
  }
  toProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.router.navigate(['/']);
  }
}
